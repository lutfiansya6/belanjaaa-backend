import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum ProductSort {
  NEWEST = 'newest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  BEST_SELLING = 'best_selling',
}

export class QueryProductsDto {
  @ApiPropertyOptional({
    description: 'Kata kunci pencarian nama atau deskripsi produk',
    example: 'sepatu',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan ID kategori produk',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Metode pengurutan produk',
    enum: ProductSort,
    default: ProductSort.NEWEST,
    example: ProductSort.NEWEST,
  })
  @IsOptional()
  @IsEnum(ProductSort, {
    message: 'sort harus salah satu dari: newest, price_asc, price_desc, best_selling',
  })
  sort?: ProductSort = ProductSort.NEWEST;

  @ApiPropertyOptional({
    description: 'Nomor halaman pagination',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Jumlah produk yang ditampilkan per halaman',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
