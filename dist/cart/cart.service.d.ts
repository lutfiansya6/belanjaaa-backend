import { PrismaService } from '../prisma/prisma.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCartEntity;
    getCart(userId: string): Promise<{
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                category: {
                    name: string;
                    id: string;
                };
            } & {
                description: string;
                categoryId: string;
                name: string;
                id: string;
                price: number;
                stock: number;
                imageUrl: string;
                sold: number;
                rating: number;
                shopId: string;
                createdAt: Date;
                updatedAt: Date;
            };
            subtotal: number;
        }[];
        totalItems: number;
        totalAmount: number;
        updatedAt: Date;
    }>;
    addToCart(userId: string, dto: AddToCartDto): Promise<{
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                category: {
                    name: string;
                    id: string;
                };
            } & {
                description: string;
                categoryId: string;
                name: string;
                id: string;
                price: number;
                stock: number;
                imageUrl: string;
                sold: number;
                rating: number;
                shopId: string;
                createdAt: Date;
                updatedAt: Date;
            };
            subtotal: number;
        }[];
        totalItems: number;
        totalAmount: number;
        updatedAt: Date;
    }>;
    updateItemQuantity(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                category: {
                    name: string;
                    id: string;
                };
            } & {
                description: string;
                categoryId: string;
                name: string;
                id: string;
                price: number;
                stock: number;
                imageUrl: string;
                sold: number;
                rating: number;
                shopId: string;
                createdAt: Date;
                updatedAt: Date;
            };
            subtotal: number;
        }[];
        totalItems: number;
        totalAmount: number;
        updatedAt: Date;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                category: {
                    name: string;
                    id: string;
                };
            } & {
                description: string;
                categoryId: string;
                name: string;
                id: string;
                price: number;
                stock: number;
                imageUrl: string;
                sold: number;
                rating: number;
                shopId: string;
                createdAt: Date;
                updatedAt: Date;
            };
            subtotal: number;
        }[];
        totalItems: number;
        totalAmount: number;
        updatedAt: Date;
    }>;
    clearCart(userId: string): Promise<{
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                category: {
                    name: string;
                    id: string;
                };
            } & {
                description: string;
                categoryId: string;
                name: string;
                id: string;
                price: number;
                stock: number;
                imageUrl: string;
                sold: number;
                rating: number;
                shopId: string;
                createdAt: Date;
                updatedAt: Date;
            };
            subtotal: number;
        }[];
        totalItems: number;
        totalAmount: number;
        updatedAt: Date;
    }>;
}
