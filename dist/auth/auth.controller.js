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
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    getMe(user) {
        return this.authService.getProfile(user.sub);
    }
};
__decorate([
    Post('register'),
    ApiOperation({
        summary: 'Registrasi pengguna baru (default role: BUYER)',
    }),
    ApiResponse({
        status: 201,
        description: 'Registrasi berhasil dan mengembalikan access token serta data pengguna.',
    }),
    ApiResponse({
        status: 400,
        description: 'Validasi input gagal.',
    }),
    ApiResponse({
        status: 409,
        description: 'Email sudah terdaftar.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
        summary: 'Login pengguna untuk mendapatkan access token',
    }),
    ApiResponse({
        status: 200,
        description: 'Login berhasil dan mengembalikan access token JWT.',
    }),
    ApiResponse({
        status: 400,
        description: 'Validasi input gagal.',
    }),
    ApiResponse({
        status: 401,
        description: 'Email atau kata sandi tidak valid.',
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({
        summary: 'Mendapatkan profil pengguna yang sedang login',
    }),
    ApiResponse({
        status: 200,
        description: 'Berhasil mengambil profil pengguna saat ini.',
    }),
    ApiResponse({
        status: 401,
        description: 'Token otentikasi tidak valid atau belum login.',
    }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
AuthController = __decorate([
    ApiTags('Auth'),
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map