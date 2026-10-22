import { PrismaService } from './prisma/prisma.service.js';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRoot(): {
        name: string;
        version: string;
        status: string;
        docs: string;
        health: string;
    };
    getHealth(): Promise<{
        status: string;
        pesan: string;
        timestamp: string;
        statistik: {
            totalPengguna: number;
            totalProduk: number;
        };
    }>;
}
