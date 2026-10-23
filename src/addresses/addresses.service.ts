import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    return address;
  }

  async create(userId: string, dto: CreateAddressDto) {
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

  async update(userId: string, id: string, dto: UpdateAddressDto) {
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

  async remove(userId: string, id: string) {
    const address = await this.findOne(userId, id);

    await this.prisma.address.delete({
      where: { id: address.id },
    });

    return { message: 'Alamat berhasil dihapus', id };
  }
}
