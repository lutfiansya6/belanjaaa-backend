import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import type { JwtPayload } from '../auth/auth.service.js';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: JwtPayload): Promise<{
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
    addToCart(user: JwtPayload, dto: AddToCartDto): Promise<{
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
    updateQuantity(user: JwtPayload, id: string, dto: UpdateCartItemDto): Promise<{
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
    removeItem(user: JwtPayload, id: string): Promise<{
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
    clearCart(user: JwtPayload): Promise<{
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
