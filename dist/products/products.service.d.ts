import { PrismaService } from '../prisma/prisma.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryProductsDto): Promise<{
        items: ({
            shop: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                city: string | null;
                userId: string;
            };
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                icon: string | null;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        shop: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            userId: string;
        };
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            icon: string | null;
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
    }>;
}
