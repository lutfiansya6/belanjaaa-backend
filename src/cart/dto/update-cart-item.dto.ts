import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Jumlah kuantitas baru produk di keranjang',
    example: 2,
  })
  @Type(() => Number)
  @IsInt({ message: 'Jumlah kuantitas harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah kuantitas minimal 1' })
  quantity: number;
}
