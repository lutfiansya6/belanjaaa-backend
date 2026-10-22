import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    const userCount = await this.prisma.user.count();
    const productCount = await this.prisma.product.count();

    return {
      status: 'ok',
      pesan: 'Layanan API Marketplace berjalan dengan baik',
      timestamp: new Date().toISOString(),
      statistik: {
        totalPengguna: userCount,
        totalProduk: productCount,
      },
    };
  }
}
