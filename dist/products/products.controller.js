var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { QueryProductsDto } from './dto/query-products.dto.js';
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Daftar produk dengan filter, pencarian, pengurutan, dan pagination',
    }),
    ApiResponse({
        status: 200,
        description: 'Berhasil mengambil daftar produk beserta metadata pagination.',
    }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({
        summary: 'Ambil detail produk berdasarkan ID (termasuk data toko dan kategori)',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik produk (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Detail produk berhasil ditemukan.',
    }),
    ApiResponse({
        status: 404,
        description: 'Produk tidak ditemukan.',
    }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
ProductsController = __decorate([
    ApiTags('Products'),
    Controller('products'),
    __metadata("design:paramtypes", [ProductsService])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map