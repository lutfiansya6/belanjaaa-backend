import { AddressesService } from './addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import type { JwtPayload } from '../auth/auth.service.js';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(user: JwtPayload): Promise<{
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
    findOne(user: JwtPayload, id: string): Promise<{
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
    create(user: JwtPayload, dto: CreateAddressDto): Promise<{
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
    update(user: JwtPayload, id: string, dto: UpdateAddressDto): Promise<{
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
    remove(user: JwtPayload, id: string): Promise<{
        message: string;
        id: string;
    }>;
}
