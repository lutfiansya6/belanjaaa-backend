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
import { AddressesService } from './addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let AddressesController = class AddressesController {
    addressesService;
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    findAll(user) {
        return this.addressesService.findAll(user.sub);
    }
    findOne(user, id) {
        return this.addressesService.findOne(user.sub, id);
    }
    create(user, dto) {
        return this.addressesService.create(user.sub, dto);
    }
    update(user, id, dto) {
        return this.addressesService.update(user.sub, id, dto);
    }
    remove(user, id) {
        return this.addressesService.remove(user.sub, id);
    }
};
__decorate([
    Get(),
    ApiOperation({
        summary: 'Mendapatkan daftar alamat pengiriman milik pengguna yang sedang login',
    }),
    ApiResponse({
        status: 200,
        description: 'Daftar alamat berhasil diambil.',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({
        summary: 'Mendapatkan detail alamat pengiriman berdasarkan ID',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik alamat (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Detail alamat ditemukan.',
    }),
    ApiResponse({
        status: 404,
        description: 'Alamat tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AddressesController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({
        summary: 'Menambahkan alamat pengiriman baru untuk pengguna',
    }),
    ApiResponse({
        status: 201,
        description: 'Alamat baru berhasil disimpan.',
    }),
    ApiResponse({
        status: 400,
        description: 'Validasi form alamat gagal.',
    }),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAddressDto]),
    __metadata("design:returntype", void 0)
], AddressesController.prototype, "create", null);
__decorate([
    Patch(':id'),
    ApiOperation({
        summary: 'Memperbarui data alamat pengiriman',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik alamat (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Alamat berhasil diperbarui.',
    }),
    ApiResponse({
        status: 404,
        description: 'Alamat tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateAddressDto]),
    __metadata("design:returntype", void 0)
], AddressesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({
        summary: 'Menghapus alamat pengiriman',
    }),
    ApiParam({
        name: 'id',
        description: 'ID unik alamat (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
        status: 200,
        description: 'Alamat berhasil dihapus.',
    }),
    ApiResponse({
        status: 404,
        description: 'Alamat tidak ditemukan.',
    }),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AddressesController.prototype, "remove", null);
AddressesController = __decorate([
    ApiTags('Addresses'),
    Controller('addresses'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [AddressesService])
], AddressesController);
export { AddressesController };
//# sourceMappingURL=addresses.controller.js.map