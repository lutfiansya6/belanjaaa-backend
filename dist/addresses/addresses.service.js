var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let AddressesService = class AddressesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(userId, id) {
        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!address) {
            throw new NotFoundException('Alamat tidak ditemukan');
        }
        return address;
    }
    async create(userId, dto) {
        const existingCount = await this.prisma.address.count({
            where: { userId },
        });
        const isDefault = dto.isDefault ?? existingCount === 0;
        if (isDefault && existingCount > 0) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.create({
            data: {
                userId,
                recipientName: dto.recipientName.trim(),
                phone: dto.phone.trim(),
                street: dto.street.trim(),
                city: dto.city.trim(),
                province: dto.province?.trim(),
                postalCode: dto.postalCode?.trim(),
                isDefault,
            },
        });
    }
    async update(userId, id, dto) {
        const address = await this.findOne(userId, id);
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.update({
            where: { id: address.id },
            data: {
                recipientName: dto.recipientName?.trim(),
                phone: dto.phone?.trim(),
                street: dto.street?.trim(),
                city: dto.city?.trim(),
                province: dto.province?.trim(),
                postalCode: dto.postalCode?.trim(),
                isDefault: dto.isDefault,
            },
        });
    }
    async remove(userId, id) {
        const address = await this.findOne(userId, id);
        await this.prisma.address.delete({
            where: { id: address.id },
        });
        return { message: 'Alamat berhasil dihapus', id };
    }
};
AddressesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AddressesService);
export { AddressesService };
//# sourceMappingURL=addresses.service.js.map