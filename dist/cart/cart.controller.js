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
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(user) {
        return this.cartService.getCart(user.sub);
    }
    addToCart(user, dto) {
        return this.cartService.addToCart(user.sub, dto);
    }
    updateQuantity(user, id, dto) {
        return this.cartService.updateItemQuantity(user.sub, id, dto);
    }
    removeItem(user, id) {
        return this.cartService.removeItem(user.sub, id);
    }
    clearCart(user) {
        return this.cartService.clearCart(user.sub);
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Mendapatkan data keranjang belanja milik pengguna saat ini',
    }),
    ApiResponse({
        status: 200,
        description: 'Data keranjang belanja berhasil diambil.',
    }),
    ApiResponse({
        status: 401,
        description: 'Pengguna belum terautentikasi.',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    Post('items'),
    ApiOperation({
        summary: 'Menambahkan produk ke dalam keranjang belanja',
    }),
    ApiResponse({
        status: 201,
        description: 'Produk berhasil ditambahkan ke keranjang.',
    }),
    ApiResponse({
        status: 400,
        description: 'Stok produk tidak mencukupi atau input tidak valid.',
    }),
    ApiResponse({
        status: 404,
        description: 'Produk tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AddToCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    Patch('items/:id'),
    ApiOperation({
        summary: 'Mengubah kuantitas item produk di dalam keranjang belanja',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik cart item (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Kuantitas item keranjang berhasil diperbarui.',
    }),
    ApiResponse({
        status: 400,
        description: 'Kuantitas melebihi stok yang tersedia.',
    }),
    ApiResponse({
        status: 404,
        description: 'Item keranjang tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateQuantity", null);
__decorate([
    Delete('items/:id'),
    ApiOperation({
        summary: 'Menghapus item tertentu dari keranjang belanja',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik cart item (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Item keranjang berhasil dihapus.',
    }),
    ApiResponse({
        status: 404,
        description: 'Item keranjang tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    Delete(),
    ApiOperation({
        summary: 'Mengosongkan seluruh isi keranjang belanja pengguna',
    }),
    ApiResponse({
        status: 200,
        description: 'Seluruh isi keranjang berhasil dikosongkan.',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
CartController = __decorate([
    ApiTags('Cart'),
    Controller('cart'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [CartService])
], CartController);
export { CartController };
//# sourceMappingURL=cart.controller.js.map