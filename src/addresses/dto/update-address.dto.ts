import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiPropertyOptional({
    description: 'Nama lengkap penerima paket',
    example: 'Budi Santoso',
  })
  @IsOptional()
  @IsString({ message: 'Nama penerima harus berupa teks' })
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon penerima yang bisa dihubungi',
    example: '081234567890',
  })
  @IsOptional()
  @IsString({ message: 'Nomor telepon harus berupa teks' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Alamat lengkap jalan, nomor rumah, RT/RW, kelurahan/kecamatan',
    example: 'Jl. Sudirman No. 45, RT 02 / RW 05, Menteng',
  })
  @IsOptional()
  @IsString({ message: 'Alamat jalan harus berupa teks' })
  street?: string;

  @ApiPropertyOptional({
    description: 'Kota atau Kabupaten',
    example: 'Jakarta Pusat',
  })
  @IsOptional()
  @IsString({ message: 'Kota harus berupa teks' })
  city?: string;

  @ApiPropertyOptional({
    description: 'Provinsi',
    example: 'DKI Jakarta',
  })
  @IsOptional()
  @IsString({ message: 'Provinsi harus berupa teks' })
  province?: string;

  @ApiPropertyOptional({
    description: 'Kode pos',
    example: '10310',
  })
  @IsOptional()
  @IsString({ message: 'Kode pos harus berupa teks' })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Tandai sebagai alamat utama pengiriman',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status default harus bernilai boolean (true/false)' })
  isDefault?: boolean;
}
