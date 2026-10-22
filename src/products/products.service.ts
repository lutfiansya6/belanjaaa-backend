import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductSort, QueryProductsDto } from './dto/query-products.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const {
      search,
      categoryId,
      sort = ProductSort.NEWEST,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search && search.trim()) {
      const keyword = search.trim();
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput;

    switch (sort) {
      case ProductSort.PRICE_ASC:
        orderBy = { price: 'asc' };
        break;
      case ProductSort.PRICE_DESC:
        orderBy = { price: 'desc' };
        break;
      case ProductSort.BEST_SELLING:
        orderBy = { sold: 'desc' };
        break;
      case ProductSort.NEWEST:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          shop: true,
          category: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        shop: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produk dengan ID '${id}' tidak ditemukan`);
    }

    return product;
  }
}
