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
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export var ProductSort;
(function (ProductSort) {
    ProductSort["NEWEST"] = "newest";
    ProductSort["PRICE_ASC"] = "price_asc";
    ProductSort["PRICE_DESC"] = "price_desc";
    ProductSort["BEST_SELLING"] = "best_selling";
})(ProductSort || (ProductSort = {}));
export class QueryProductsDto {
    search;
    categoryId;
    sort = ProductSort.NEWEST;
    page = 1;
    limit = 10;
}
__decorate([
    ApiPropertyOptional({
        description: 'Kata kunci pencarian nama atau deskripsi produk',
        example: 'sepatu',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "search", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Filter berdasarkan ID kategori produk',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "categoryId", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Metode pengurutan produk',
        enum: ProductSort,
        default: ProductSort.NEWEST,
        example: ProductSort.NEWEST,
    }),
    IsOptional(),
    IsEnum(ProductSort, {
        message: 'sort harus salah satu dari: newest, price_asc, price_desc, best_selling',
    }),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "sort", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nomor halaman pagination',
        default: 1,
        minimum: 1,
        example: 1,
    }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Jumlah produk yang ditampilkan per halaman',
        default: 10,
        minimum: 1,
        maximum: 100,
        example: 10,
    }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "limit", void 0);
//# sourceMappingURL=query-products.dto.js.map