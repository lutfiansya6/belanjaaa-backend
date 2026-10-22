import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Alamat email unik pengguna',
    example: 'userbaru@shopee.test',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({
    description: 'Kata sandi pengguna (minimal 6 karakter)',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Password harus berupa teks' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'Ahmad Dahlan',
  })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  name: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon pengguna',
    example: '081234567890',
  })
  @IsOptional()
  @IsString({ message: 'Nomor telepon harus berupa teks' })
  phone?: string;
}
