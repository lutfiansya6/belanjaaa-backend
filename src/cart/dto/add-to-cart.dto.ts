import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID produk yang ingin dimasukkan ke keranjang',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'Product ID harus berupa teks' })
  @IsNotEmpty({ message: 'Product ID wajib diisi' })
  productId: string;

  @ApiPropertyOptional({
    description: 'Jumlah kuantitas produk yang ditambahkan',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Jumlah kuantitas harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah kuantitas minimal 1' })
  quantity?: number = 1;
}
