import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategories = [
    {
      id: 'cat-1',
      name: 'Elektronik',
      icon: 'zap',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findMany: vi.fn().mockResolvedValue(mockCategories),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should return all categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockCategories);
  });
});
