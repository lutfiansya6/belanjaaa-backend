var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name: dto.name.trim(),
                phone: dto.phone?.trim(),
                role: Role.BUYER,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            message: 'Registrasi berhasil',
            accessToken,
            user,
        };
    }
    async login(dto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
            },
        });
        if (!user) {
            throw new UnauthorizedException('Email atau kata sandi tidak valid');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email atau kata sandi tidak valid');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'Login berhasil',
            accessToken,
            user: userWithoutPassword,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                shop: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException('Pengguna tidak ditemukan');
        }
        return user;
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map