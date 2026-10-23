import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

describe('CartController', () => {
  let controller: CartController;

  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        subtotal: 100000,
        product: {
          id: 'prod-1',
          name: 'Kemeja Katun',
          price: 50000,
          stock: 10,
        },
      },
    ],
    totalItems: 2,
    totalAmount: 100000,
  };

  const mockUser = {
    sub: 'user-1',
    email: 'user@shopee.test',
    role: 'BUYER' as const,
    name: 'User Test',
  };

  const mockCartService = {
    getCart: vi.fn().mockResolvedValue(mockCart),
    addToCart: vi.fn().mockResolvedValue(mockCart),
    updateItemQuantity: vi.fn().mockResolvedValue(mockCart),
    removeItem: vi.fn().mockResolvedValue(mockCart),
    clearCart: vi.fn().mockResolvedValue({ ...mockCart, items: [], totalItems: 0, totalAmount: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
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

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart data for user', async () => {
      const result = await controller.getCart(mockUser);
      expect(result).toEqual(mockCart);
      expect(mockCartService.getCart).toHaveBeenCalledWith('user-1');
    });
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const dto = { productId: 'prod-1', quantity: 2 };
      const result = await controller.addToCart(mockUser, dto);
      expect(result).toEqual(mockCart);
      expect(mockCartService.addToCart).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const dto = { quantity: 3 };
      const result = await controller.updateQuantity(mockUser, 'item-1', dto);
      expect(result).toEqual(mockCart);
      expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith('user-1', 'item-1', dto);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const result = await controller.removeItem(mockUser, 'item-1');
      expect(result).toEqual(mockCart);
      expect(mockCartService.removeItem).toHaveBeenCalledWith('user-1', 'item-1');
    });
  });

  describe('clearCart', () => {
    it('should clear all items in cart', async () => {
      const result = await controller.clearCart(mockUser);
      expect(result.items).toHaveLength(0);
      expect(mockCartService.clearCart).toHaveBeenCalledWith('user-1');
    });
  });
});
