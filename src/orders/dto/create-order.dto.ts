import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description:
      'ID alamat pengiriman yang dipilih. Jika tidak diisi, akan otomatis menggunakan alamat default pengguna jika ada.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'Address ID harus berupa teks' })
  addressId?: string;
}
