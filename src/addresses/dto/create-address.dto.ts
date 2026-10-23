import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Nama lengkap penerima paket',
    example: 'Budi Santoso',
  })
  @IsString({ message: 'Nama penerima harus berupa teks' })
  @IsNotEmpty({ message: 'Nama penerima wajib diisi' })
  recipientName: string;

  @ApiProperty({
    description: 'Nomor telepon penerima yang bisa dihubungi',
    example: '081234567890',
  })
  @IsString({ message: 'Nomor telepon harus berupa teks' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  phone: string;

  @ApiProperty({
    description: 'Alamat lengkap jalan, nomor rumah, RT/RW, kelurahan/kecamatan',
    example: 'Jl. Sudirman No. 45, RT 02 / RW 05, Menteng',
  })
  @IsString({ message: 'Alamat jalan harus berupa teks' })
  @IsNotEmpty({ message: 'Alamat jalan wajib diisi' })
  street: string;

  @ApiProperty({
    description: 'Kota atau Kabupaten',
    example: 'Jakarta Pusat',
  })
  @IsString({ message: 'Kota harus berupa teks' })
  @IsNotEmpty({ message: 'Kota wajib diisi' })
  city: string;

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
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status default harus bernilai boolean (true/false)' })
  isDefault?: boolean;
}
