import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Daftar produk dengan filter, pencarian, pengurutan, dan pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil daftar produk beserta metadata pagination.',
  })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Ambil detail produk berdasarkan ID (termasuk data toko dan kategori)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik produk (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail produk berhasil ditemukan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produk tidak ditemukan.',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
