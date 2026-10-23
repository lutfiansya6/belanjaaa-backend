import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromCart(userId: string, dto: CreateOrderDto) {
    // 1. Validasi alamat jika dikirimkan oleh pengguna
    let addressId: string | null = null;
    if (dto.addressId) {
      const address = await this.prisma.address.findFirst({
        where: { id: dto.addressId, userId },
      });

      if (!address) {
        throw new NotFoundException(
          'Alamat pengiriman tidak ditemukan atau bukan milik Anda',
        );
      }
      addressId = address.id;
    } else {
      // Jika tidak diisi, gunakan alamat default pengguna (jika ada)
      const defaultAddress = await this.prisma.address.findFirst({
        where: { userId, isDefault: true },
      });
      addressId = defaultAddress?.id ?? null;
    }

    // 2. Transaksi database untuk memproses pesanan dan memotong stok
    return this.prisma.$transaction(async (tx) => {
      // Ambil keranjang pengguna beserta item dan produknya
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException(
          'Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.',
        );
      }

      // Validasi ketersediaan stok untuk semua item di keranjang
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produk dengan ID ${item.productId} tidak ditemukan.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stok produk "${product.name}" tidak mencukupi untuk membuat pesanan (tersedia: ${product.stock}, diminta: ${item.quantity}).`,
          );
        }
      }

      // Kurangi stok produk dan tambahkan sold count
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
            sold: {
              increment: item.quantity,
            },
          },
        });
      }

      // Hitung total harga pesanan
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      // Buat pesanan baru beserta detail OrderItem
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount,
          addressId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  shop: {
                    select: {
                      id: true,
                      name: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
          address: true,
        },
      });

      // Kosongkan isi keranjang pengguna setelah order berhasil dibuat
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                shop: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                shop: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    return order;
  }

  async cancelOrder(userId: string, orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          `Pesanan dengan status "${order.status}" tidak dapat dibatalkan. Pembatalan hanya berlaku untuk status PENDING.`,
        );
      }

      // Kembalikan stok produk
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
              sold: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Perbarui status pesanan menjadi CANCELLED
      return tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          items: true,
          address: true,
        },
      });
    });
  }

  async updateStatus(
    userId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.findOne(userId, orderId);

    // Jika status diubah menjadi CANCELLED dari PENDING, gunakan alur cancelOrder untuk restore stok
    if (
      dto.status === OrderStatus.CANCELLED &&
      order.status === OrderStatus.PENDING
    ) {
      return this.cancelOrder(userId, orderId);
    }

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: dto.status,
      },
      include: {
        items: true,
        address: true,
      },
    });
  }
}
