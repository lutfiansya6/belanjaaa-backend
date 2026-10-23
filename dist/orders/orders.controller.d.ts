import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import type { JwtPayload } from '../auth/auth.service.js';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createFromCart(user: JwtPayload, dto: CreateOrderDto): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            userId: string;
            phone: string;
            recipientName: string;
            street: string;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                name: string;
                id: string;
                imageUrl: string;
            } | null;
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
    findAll(user: JwtPayload): Promise<({
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            userId: string;
            phone: string;
            recipientName: string;
            street: string;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                name: string;
                id: string;
                imageUrl: string;
            } | null;
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    })[]>;
    findOne(user: JwtPayload, id: string): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            userId: string;
            phone: string;
            recipientName: string;
            street: string;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
                shop: {
                    name: string;
                    id: string;
                    city: string | null;
                };
                name: string;
                id: string;
                imageUrl: string;
            } | null;
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
    cancelOrder(user: JwtPayload, id: string): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            userId: string;
            phone: string;
            recipientName: string;
            street: string;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
        } | null;
        items: {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
    updateStatus(user: JwtPayload, id: string, dto: UpdateOrderStatusDto): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string;
            userId: string;
            phone: string;
            recipientName: string;
            street: string;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
        } | null;
        items: {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            quantity: number;
            productName: string;
            subtotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        addressId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
    }>;
}
