import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaymentsService } from './payments.service.js';
import { MidtransService } from './midtrans.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let midtransService: MidtransService;

  const mockProduct = {
    id: 'prod-1',
    name: 'Sepatu Running',
    stock: 10,
    sold: 5,
  };

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    totalAmount: 150000,
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        price: 75000,
      },
    ],
  };

  const mockPayment = {
    id: 'pay-1',
    orderId: 'order-1',
    midtransOrderId: 'order-1',
    status: 'PENDING',
    grossAmount: 150000,
    rawPayload: null,
  };

  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      payment: {
        findUnique: vi.fn(),
        update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockPayment, ...data })),
        create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'new-pay-id', ...data })),
      },
      order: {
        findUnique: vi.fn(),
        update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockOrder, ...data })),
      },
      product: {
        update: vi.fn().mockResolvedValue(mockProduct),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => callback(mockPrisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: MidtransService,
          useValue: {
            verifySignature: vi.fn(),
            createSignature: vi.fn(),
            createSnapTransaction: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    midtransService = module.get<MidtransService>(MidtransService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException if signature is invalid', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(false);

      const fakePayload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'invalid-signature-key',
        transaction_status: 'settlement',
      };

      await expect(service.handleWebhook(fakePayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if order does not exist', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(true);
      mockPrisma.payment.findUnique.mockResolvedValue(null);
      mockPrisma.order.findUnique.mockResolvedValue(null);

      const payload = {
        order_id: 'unknown-order',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'valid-signature',
        transaction_status: 'settlement',
      };

      await expect(service.handleWebhook(payload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update PENDING order to PAID on settlement status', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(true);
      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const payload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'valid-signature',
        transaction_status: 'settlement',
        payment_type: 'bank_transfer',
      };

      const result = await service.handleWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.orderStatus).toBe(OrderStatus.PAID);
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: OrderStatus.PAID },
      });
      expect(mockPrisma.payment.update).toHaveBeenCalled();
    });

    it('should update PENDING order to CANCELLED and restore stock on expire/cancel/deny', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(true);
      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);

      const payload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'valid-signature',
        transaction_status: 'expire',
        payment_type: 'bank_transfer',
      };

      const result = await service.handleWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.orderStatus).toBe(OrderStatus.CANCELLED);
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { status: OrderStatus.CANCELLED },
      });
      // Verifikasi pengembalian stok
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          stock: { increment: 2 },
          sold: { decrement: 2 },
        },
      });
    });

    it('should be idempotent: duplicate settlement when order is already PAID does not re-process', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(true);
      mockPrisma.payment.findUnique.mockResolvedValue({
        ...mockPayment,
        status: 'settlement',
      });
      mockPrisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PAID,
      });

      const payload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'valid-signature',
        transaction_status: 'settlement',
      };

      const result = await service.handleWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.message).toContain('idempotent');
      // Order status harus tetap PAID dan tidak ada update order baru
      expect(mockPrisma.order.update).not.toHaveBeenCalled();
    });

    it('should be idempotent: duplicate cancel when order is already CANCELLED does not restore stock twice', async () => {
      vi.spyOn(midtransService, 'verifySignature').mockReturnValue(true);
      mockPrisma.payment.findUnique.mockResolvedValue({
        ...mockPayment,
        status: 'cancel',
      });
      mockPrisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.CANCELLED,
      });

      const payload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'valid-signature',
        transaction_status: 'cancel',
      };

      const result = await service.handleWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.message).toContain('idempotent');
      // Stok tidak boleh dikembalikan lagi
      expect(mockPrisma.product.update).not.toHaveBeenCalled();
    });
  });
});
