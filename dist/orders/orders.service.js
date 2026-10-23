var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFromCart(userId, dto) {
        let addressId = null;
        if (dto.addressId) {
            const address = await this.prisma.address.findFirst({
                where: { id: dto.addressId, userId },
            });
            if (!address) {
                throw new NotFoundException('Alamat pengiriman tidak ditemukan atau bukan milik Anda');
            }
            addressId = address.id;
        }
        else {
            const defaultAddress = await this.prisma.address.findFirst({
                where: { userId, isDefault: true },
            });
            addressId = defaultAddress?.id ?? null;
        }
        return this.prisma.$transaction(async (tx) => {
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
                throw new BadRequestException('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            }
            for (const item of cart.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new NotFoundException(`Produk dengan ID ${item.productId} tidak ditemukan.`);
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestException(`Stok produk "${product.name}" tidak mencukupi untuk membuat pesanan (tersedia: ${product.stock}, diminta: ${item.quantity}).`);
                }
            }
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
            const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return order;
        });
    }
    async findAll(userId) {
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
    async findOne(userId, orderId) {
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
    async cancelOrder(userId, orderId) {
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
                throw new BadRequestException(`Pesanan dengan status "${order.status}" tidak dapat dibatalkan. Pembatalan hanya berlaku untuk status PENDING.`);
            }
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
    async updateStatus(userId, orderId, dto) {
        const order = await this.findOne(userId, orderId);
        if (dto.status === OrderStatus.CANCELLED &&
            order.status === OrderStatus.PENDING) {
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
};
OrdersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], OrdersService);
export { OrdersService };
//# sourceMappingURL=orders.service.js.map