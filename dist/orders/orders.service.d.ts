import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createFromCart(userId: string, dto: CreateOrderDto): Promise<{
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
    findAll(userId: string): Promise<({
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
    findOne(userId: string, orderId: string): Promise<{
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
    cancelOrder(userId: string, orderId: string): Promise<{
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
    updateStatus(userId: string, orderId: string, dto: UpdateOrderStatusDto): Promise<{
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
