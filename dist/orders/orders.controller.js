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
import { Body, Controller, Get, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createFromCart(user, dto) {
        return this.ordersService.createFromCart(user.sub, dto);
    }
    findAll(user) {
        return this.ordersService.findAll(user.sub);
    }
    findOne(user, id) {
        return this.ordersService.findOne(user.sub, id);
    }
    cancelOrder(user, id) {
        return this.ordersService.cancelOrder(user.sub, id);
    }
    updateStatus(user, id, dto) {
        return this.ordersService.updateStatus(user.sub, id, dto);
    }
    pay(user, id) {
        return this.ordersService.pay(user.sub, id);
    }
};
__decorate([
    Post(),
    ApiOperation({
        summary: 'Membuat pesanan baru dari isi keranjang belanja (transaksi database dengan validasi & pemotongan stok)',
    }),
    ApiResponse({
        status: 201,
        description: 'Pesanan berhasil dibuat, stok produk terpotong, dan keranjang belanja dikosongkan.',
    }),
    ApiResponse({
        status: 400,
        description: 'Keranjang belanja kosong atau stok produk tidak mencukupi untuk memenuhi pesanan.',
    }),
    ApiResponse({
        status: 404,
        description: 'Produk atau alamat pengiriman tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createFromCart", null);
__decorate([
    Get(),
    ApiOperation({
        summary: 'Mendapatkan seluruh riwayat pesanan milik pengguna yang sedang login',
    }),
    ApiResponse({
        status: 200,
        description: 'Daftar pesanan pengguna berhasil diambil.',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({
        summary: 'Mendapatkan detail pesanan berdasarkan ID pesanan',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik pesanan (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Detail pesanan ditemukan.',
    }),
    ApiResponse({
        status: 404,
        description: 'Pesanan tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    Patch(':id/cancel'),
    ApiOperation({
        summary: 'Membatalkan pesanan (hanya untuk status PENDING) dan mengembalikan stok produk ke etalase',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik pesanan (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Pesanan berhasil dibatalkan dan stok produk telah dikembalikan.',
    }),
    ApiResponse({
        status: 400,
        description: 'Pesanan tidak dapat dibatalkan karena status bukan lagi PENDING.',
    }),
    ApiResponse({
        status: 404,
        description: 'Pesanan tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
__decorate([
    Patch(':id/status'),
    ApiOperation({
        summary: 'Memperbarui status pesanan (PENDING, PAID, SHIPPED, COMPLETED, CANCELLED)',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik pesanan (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Status pesanan berhasil diperbarui.',
    }),
    ApiResponse({
        status: 400,
        description: 'Status tidak valid atau transisi tidak diperbolehkan.',
    }),
    ApiResponse({
        status: 404,
        description: 'Pesanan tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    Post(':id/pay'),
    ApiOperation({
        summary: 'Mendapatkan Snap token dan redirect URL untuk pembayaran Midtrans (hanya pemilik pesanan & status PENDING)',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik pesanan (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 201,
        description: 'Snap token dan redirect URL berhasil didapatkan untuk pembayaran Midtrans.',
    }),
    ApiResponse({
        status: 400,
        description: 'Pesanan bukan berstatus PENDING.',
    }),
    ApiResponse({
        status: 403,
        description: 'Hanya pemilik pesanan yang dapat melakukan pembayaran.',
    }),
    ApiResponse({
        status: 404,
        description: 'Pesanan tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "pay", null);
OrdersController = __decorate([
    ApiTags('Orders'),
    Controller('orders'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [OrdersService])
], OrdersController);
export { OrdersController };
//# sourceMappingURL=orders.controller.js.map