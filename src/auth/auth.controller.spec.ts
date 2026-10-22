import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    phone: '08123456789',
    role: Role.BUYER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthService = {
    register: vi.fn().mockImplementation(async (dto) => {
      if (dto.email === 'duplicate@example.com') {
        throw new ConflictException('Email sudah terdaftar');
      }
      return {
        message: 'Registrasi berhasil',
        accessToken: 'mock-jwt-token',
        user: { ...mockUser, email: dto.email, name: dto.name },
      };
    }),
    login: vi.fn().mockImplementation(async (dto) => {
      if (dto.email === 'wrong@example.com' || dto.password === 'wrong') {
        throw new UnauthorizedException('Email atau kata sandi tidak valid');
      }
      return {
        message: 'Login berhasil',
        accessToken: 'mock-jwt-token',
        user: mockUser,
      };
    }),
    getProfile: vi.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn().mockResolvedValue('mock-token'),
            verifyAsync: vi.fn().mockResolvedValue({ sub: 'user-1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };
      const result = await controller.register(dto);
      expect(result.message).toBe('Registrasi berhasil');
      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Duplicate User',
      };
      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login and return access token', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await controller.login(dto);
      expect(result.message).toBe('Login berhasil');
      expect(result.accessToken).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException on wrong credentials', async () => {
      const dto = {
        email: 'wrong@example.com',
        password: 'wrong',
      };
      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getMe', () => {
    it('should return current user profile', async () => {
      const result = await controller.getMe({
        sub: 'user-1',
        email: 'test@example.com',
        role: Role.BUYER,
        name: 'Test User',
      });
      expect(result.id).toBe('user-1');
      expect(result.name).toBe('Test User');
    });
  });
});
