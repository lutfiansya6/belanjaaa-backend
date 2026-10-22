import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductSort } from './dto/query-products.dto.js';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProduct = {
    id: 'prod-1',
    name: 'Sepatu Sneakers',
    description: 'Sepatu keren',
    price: 150000,
    stock: 20,
    imageUrl: 'https://example.com/image.jpg',
    sold: 50,
    rating: 4.8,
    shopId: 'shop-1',
    categoryId: 'cat-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    shop: { id: 'shop-1', name: 'Toko Keren' },
    category: { id: 'cat-1', name: 'Sepatu' },
  };

  const mockPrisma = {
    product: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([mockProduct]),
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (where.id === 'prod-1') return Promise.resolve(mockProduct);
        return Promise.resolve(null);
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  describe('findAll', () => {
    it('should return products and pagination meta', async () => {
      const result = await controller.findAll({
        sort: ProductSort.NEWEST,
        page: 1,
        limit: 10,
      });

      expect(result.items).toEqual([mockProduct]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return product details when found', async () => {
      const result = await controller.findOne('prod-1');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
