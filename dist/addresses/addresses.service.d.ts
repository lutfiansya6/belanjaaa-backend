import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
export declare class AddressesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        userId: string;
        phone: string;
        recipientName: string;
        street: string;
        province: string | null;
        postalCode: string | null;
        isDefault: boolean;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        userId: string;
        phone: string;
        recipientName: string;
        street: string;
        province: string | null;
        postalCode: string | null;
        isDefault: boolean;
    }>;
    create(userId: string, dto: CreateAddressDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        userId: string;
        phone: string;
        recipientName: string;
        street: string;
        province: string | null;
        postalCode: string | null;
        isDefault: boolean;
    }>;
    update(userId: string, id: string, dto: UpdateAddressDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        city: string;
        userId: string;
        phone: string;
        recipientName: string;
        street: string;
        province: string | null;
        postalCode: string | null;
        isDefault: boolean;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
        id: string;
    }>;
}
