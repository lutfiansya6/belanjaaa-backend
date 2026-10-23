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
import { PrismaService } from '../prisma/prisma.service.js';
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCartEntity(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
            });
        }
        return cart;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCartEntity(userId);
        const fullCart = await this.prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                shop: {
                                    select: {
                                        id: true,
                                        name: true,
                                        city: true,
                                    },
                                },
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!fullCart) {
            throw new NotFoundException('Keranjang tidak ditemukan');
        }
        const itemsWithSubtotal = fullCart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            product: item.product,
            subtotal: item.product.price * item.quantity,
        }));
        const totalAmount = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = itemsWithSubtotal.reduce((sum, item) => sum + item.quantity, 0);
        return {
            id: fullCart.id,
            userId: fullCart.userId,
            items: itemsWithSubtotal,
            totalItems,
            totalAmount,
            updatedAt: fullCart.updatedAt,
        };
    }
    async addToCart(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new NotFoundException('Produk tidak ditemukan');
        }
        const quantityToAdd = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;
        const cart = await this.getOrCreateCartEntity(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });
        const targetQuantity = (existingItem?.quantity ?? 0) + quantityToAdd;
        if (product.stock < targetQuantity) {
            throw new BadRequestException(`Stok produk "${product.name}" tidak mencukupi (tersedia: ${product.stock}, diminta di keranjang: ${targetQuantity})`);
        }
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: targetQuantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: quantityToAdd,
                },
            });
        }
        return this.getCart(userId);
    }
    async updateItemQuantity(userId, itemId, dto) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true,
            },
        });
        if (!item || item.cart.userId !== userId) {
            throw new NotFoundException('Item keranjang tidak ditemukan');
        }
        if (item.product.stock < dto.quantity) {
            throw new BadRequestException(`Stok produk "${item.product.name}" tidak mencukupi (tersedia: ${item.product.stock}, diminta: ${dto.quantity})`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true },
        });
        if (!item || item.cart.userId !== userId) {
            throw new NotFoundException('Item keranjang tidak ditemukan');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCartEntity(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return this.getCart(userId);
    }
};
CartService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CartService);
export { CartService };
//# sourceMappingURL=cart.service.js.map