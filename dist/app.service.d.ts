import { PrismaService } from './prisma/prisma.service.js';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
