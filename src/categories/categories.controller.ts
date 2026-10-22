import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar semua kategori produk' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil seluruh daftar kategori produk.',
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}
