var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class RegisterDto {
    email;
    password;
    name;
    phone;
}
__decorate([
    ApiProperty({
        description: 'Alamat email unik pengguna',
        example: 'userbaru@shopee.test',
    }),
    IsEmail({}, { message: 'Format email tidak valid' }),
    IsNotEmpty({ message: 'Email wajib diisi' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    ApiProperty({
        description: 'Kata sandi pengguna (minimal 6 karakter)',
        example: 'password123',
        minLength: 6,
    }),
    IsString({ message: 'Password harus berupa teks' }),
    IsNotEmpty({ message: 'Password wajib diisi' }),
    MinLength(6, { message: 'Password minimal 6 karakter' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    ApiProperty({
        description: 'Nama lengkap pengguna',
        example: 'Ahmad Dahlan',
    }),
    IsString({ message: 'Nama harus berupa teks' }),
    IsNotEmpty({ message: 'Nama lengkap wajib diisi' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nomor telepon pengguna',
        example: '081234567890',
    }),
    IsOptional(),
    IsString({ message: 'Nomor telepon harus berupa teks' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
//# sourceMappingURL=register.dto.js.map