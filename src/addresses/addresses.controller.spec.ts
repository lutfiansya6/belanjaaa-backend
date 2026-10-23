import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller.js';
import { AddressesService } from './addresses.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

describe('AddressesController', () => {
  let controller: AddressesController;

  const mockAddress = {
    id: 'addr-1',
    userId: 'user-1',
    recipientName: 'Budi Santoso',
    phone: '081234567890',
    street: 'Jl. Sudirman 10',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '10110',
    isDefault: true,
  };

  const mockUser = {
    sub: 'user-1',
    email: 'user@shopee.test',
    role: 'BUYER' as const,
    name: 'User Test',
  };

  const mockAddressesService = {
    findAll: vi.fn().mockResolvedValue([mockAddress]),
    findOne: vi.fn().mockResolvedValue(mockAddress),
    create: vi.fn().mockResolvedValue(mockAddress),
    update: vi.fn().mockResolvedValue(mockAddress),
    remove: vi.fn().mockResolvedValue({ message: 'Alamat berhasil dihapus', id: 'addr-1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all user addresses', async () => {
      const result = await controller.findAll(mockUser);
      expect(result).toEqual([mockAddress]);
      expect(mockAddressesService.findAll).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return address by id', async () => {
      const result = await controller.findOne(mockUser, 'addr-1');
      expect(result).toEqual(mockAddress);
      expect(mockAddressesService.findOne).toHaveBeenCalledWith('user-1', 'addr-1');
    });
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const dto = {
        recipientName: 'Budi Santoso',
        phone: '081234567890',
        street: 'Jl. Sudirman 10',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '10110',
        isDefault: true,
      };
      const result = await controller.create(mockUser, dto);
      expect(result).toEqual(mockAddress);
      expect(mockAddressesService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('remove', () => {
    it('should remove address', async () => {
      const result = await controller.remove(mockUser, 'addr-1');
      expect(result).toEqual({ message: 'Alamat berhasil dihapus', id: 'addr-1' });
      expect(mockAddressesService.remove).toHaveBeenCalledWith('user-1', 'addr-1');
    });
  });
});
