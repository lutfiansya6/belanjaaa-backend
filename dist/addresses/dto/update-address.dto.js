var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class UpdateAddressDto {
    recipientName;
    phone;
    street;
    city;
    province;
    postalCode;
    isDefault;
}
__decorate([
    ApiPropertyOptional({
        description: 'Nama lengkap penerima paket',
        example: 'Budi Santoso',
    }),
    IsOptional(),
    IsString({ message: 'Nama penerima harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "recipientName", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nomor telepon penerima yang bisa dihubungi',
        example: '081234567890',
    }),
    IsOptional(),
    IsString({ message: 'Nomor telepon harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Alamat lengkap jalan, nomor rumah, RT/RW, kelurahan/kecamatan',
        example: 'Jl. Sudirman No. 45, RT 02 / RW 05, Menteng',
    }),
    IsOptional(),
    IsString({ message: 'Alamat jalan harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "street", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Kota atau Kabupaten',
        example: 'Jakarta Pusat',
    }),
    IsOptional(),
    IsString({ message: 'Kota harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "city", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Provinsi',
        example: 'DKI Jakarta',
    }),
    IsOptional(),
    IsString({ message: 'Provinsi harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "province", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Kode pos',
        example: '10310',
    }),
    IsOptional(),
    IsString({ message: 'Kode pos harus berupa teks' }),
    __metadata("design:type", String)
], UpdateAddressDto.prototype, "postalCode", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Tandai sebagai alamat utama pengiriman',
        example: true,
    }),
    IsOptional(),
    IsBoolean({ message: 'Status default harus bernilai boolean (true/false)' }),
    __metadata("design:type", Boolean)
], UpdateAddressDto.prototype, "isDefault", void 0);
//# sourceMappingURL=update-address.dto.js.map