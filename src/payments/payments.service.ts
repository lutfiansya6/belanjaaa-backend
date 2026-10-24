import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { MidtransService } from './midtrans.service.js';
import { MidtransWebhookDto } from './dto/midtrans-webhook.dto.js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly midtransService: MidtransService,
  ) {}

  async handleWebhook(payload: MidtransWebhookDto) {
    this.logger.log(
      `Received Midtrans webhook for order_id: ${payload.order_id}, status: ${payload.transaction_status}`,
    );

    // 1. Verifikasi signature_key
    const isValidSignature = this.midtransService.verifySignature({
      order_id: payload.order_id,
      status_code: payload.status_code,
      gross_amount: payload.gross_amount,
      signature_key: payload.signature_key,
    });

    if (!isValidSignature) {
      this.logger.warn(`Invalid signature key received for order_id: ${payload.order_id}`);
      throw new BadRequestException('Signature key tidak valid');
    }

    // 2. Cari data pembayaran atau pesanan terkait
    const midtransOrderId = payload.order_id;
    let payment = await this.prisma.payment.findUnique({
      where: { midtransOrderId },
    });

    let orderId = payment?.orderId;

    if (!orderId) {
      // Fallback: periksa apakah order_id adalah ID order langsung
      const directOrder = await this.prisma.order.findUnique({
        where: { id: midtransOrderId },
      });
      if (directOrder) {
        orderId = directOrder.id;
      }
    }

    if (!orderId) {
      throw new NotFoundException(
        `Pesanan dengan ID transaksi ${midtransOrderId} tidak ditemukan`,
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Pesanan ${orderId} tidak ditemukan`);
    }

    const status = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    // 3. Pengecekan Idempotensi (Notifikasi ganda tidak diproses dua kali)
    const isPaidStatus =
      status === 'settlement' ||
      (status === 'capture' && fraudStatus === 'accept');
    const isCancelledStatus = ['expire', 'cancel', 'deny'].includes(status);

    if (isPaidStatus && order.status === OrderStatus.PAID) {
      this.logger.log(
        `Idempotent duplicate: Order ${order.id} is already PAID. Skipping re-processing.`,
      );
      // Perbarui rawPayload terbaru jika diperlukan
      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { rawPayload: JSON.stringify(payload) },
        });
      }
      return {
        success: true,
        message: 'Notification already processed (idempotent)',
        orderStatus: order.status,
      };
    }

    if (isCancelledStatus && order.status === OrderStatus.CANCELLED) {
      this.logger.log(
        `Idempotent duplicate: Order ${order.id} is already CANCELLED. Skipping stock restore.`,
      );
      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { rawPayload: JSON.stringify(payload) },
        });
      }
      return {
        success: true,
        message: 'Notification already processed (idempotent)',
        orderStatus: order.status,
      };
    }

    if (payment && payment.status === status) {
      this.logger.log(
        `Idempotent duplicate: Payment ${payment.id} already has status ${status}. Skipping.`,
      );
      return {
        success: true,
        message: `Notification already processed for status ${status} (idempotent)`,
        orderStatus: order.status,
      };
    }

    // 4. Proses Transisi Status & Simpan ke tabel Payment dalam database transaction
    return this.prisma.$transaction(async (tx) => {
      let updatedOrderStatus = order.status;

      // Status settlement/capture: ubah status order PENDING menjadi PAID
      if (isPaidStatus) {
        if (order.status === OrderStatus.PENDING) {
          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.PAID },
          });
          updatedOrderStatus = OrderStatus.PAID;
        }
      }
      // Status expire/cancel/deny: ubah status order PENDING menjadi CANCELLED dan kembalikan stok
      else if (isCancelledStatus) {
        if (order.status === OrderStatus.PENDING) {
          for (const item of order.items) {
            if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: { increment: item.quantity },
                  sold: { decrement: item.quantity },
                },
              });
            }
          }

          await tx.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.CANCELLED },
          });
          updatedOrderStatus = OrderStatus.CANCELLED;
        }
      }

      // 5. Simpan / Perbarui data transaksi di tabel Payment
      const grossAmount = payload.gross_amount
        ? Math.round(Number(payload.gross_amount))
        : order.totalAmount;

      const rawPayload = JSON.stringify(payload);

      if (payment) {
        payment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status,
            rawPayload,
            paymentType: payload.payment_type ?? payment.paymentType,
            grossAmount,
          },
        });
      } else {
        payment = await tx.payment.create({
          data: {
            orderId: order.id,
            midtransOrderId,
            status,
            rawPayload,
            paymentType: payload.payment_type ?? null,
            grossAmount,
          },
        });
      }

      return {
        success: true,
        message: 'Notification processed successfully',
        orderId: order.id,
        orderStatus: updatedOrderStatus,
        paymentStatus: payment.status,
      };
    });
  }

  async getPaymentsByOrderId(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

