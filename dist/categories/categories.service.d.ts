import { PrismaService } from '../prisma/prisma.service.js';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string | null;
    }[]>;
}
