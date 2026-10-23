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
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class AddToCartDto {
    productId;
    quantity = 1;
}
__decorate([
    ApiProperty({
        description: 'ID produk yang ingin dimasukkan ke keranjang',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsString({ message: 'Product ID harus berupa teks' }),
    IsNotEmpty({ message: 'Product ID wajib diisi' }),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Jumlah kuantitas produk yang ditambahkan',
        example: 1,
        default: 1,
    }),
    IsOptional(),
    Type(() => Number),
    IsInt({ message: 'Jumlah kuantitas harus berupa bilangan bulat' }),
    Min(1, { message: 'Jumlah kuantitas minimal 1' }),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
//# sourceMappingURL=add-to-cart.dto.js.map