import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
