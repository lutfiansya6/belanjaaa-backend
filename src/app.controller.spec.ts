import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            user: { count: vi.fn().mockResolvedValue(16) },
            product: { count: vi.fn().mockResolvedValue(100) },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API information', () => {
      const result = appController.getRoot();
      expect(result.status).toBe('active');
      expect(result.docs).toBe('/docs');
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      const result = await appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.statistik.totalPengguna).toBe(16);
      expect(result.statistik.totalProduk).toBe(100);
    });
  });
});
