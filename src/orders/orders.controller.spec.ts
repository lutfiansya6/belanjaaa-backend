import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { OrderStatus } from '@prisma/client';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    totalAmount: 150000,
    addressId: 'addr-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Sepatu',
        price: 150000,
        quantity: 1,
        subtotal: 150000,
      },
    ],
  };

  const mockUser = {
    sub: 'user-1',
    email: 'user@shopee.test',
    role: 'BUYER' as const,
    name: 'User Test',
  };

  const mockOrdersService = {
    createFromCart: vi.fn().mockResolvedValue(mockOrder),
    findAll: vi.fn().mockResolvedValue([mockOrder]),
    findOne: vi.fn().mockResolvedValue(mockOrder),
    cancelOrder: vi.fn().mockResolvedValue({ ...mockOrder, status: OrderStatus.CANCELLED }),
    updateStatus: vi.fn().mockResolvedValue({ ...mockOrder, status: OrderStatus.PAID }),
    pay: vi.fn().mockResolvedValue({
      token: 'snap-token-123',
      redirectUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
      redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
      snapToken: 'snap-token-123',
      midtransOrderId: 'order-1',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
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

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFromCart', () => {
    it('should create an order from cart', async () => {
      const dto = { addressId: 'addr-1' };
      const result = await controller.createFromCart(mockUser, dto);
      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.createFromCart).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return user orders list', async () => {
      const result = await controller.findAll(mockUser);
      expect(result).toEqual([mockOrder]);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return order detail', async () => {
      const result = await controller.findOne(mockUser, 'order-1');
      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith('user-1', 'order-1');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel pending order', async () => {
      const result = await controller.cancelOrder(mockUser, 'order-1');
      expect(result.status).toEqual(OrderStatus.CANCELLED);
      expect(mockOrdersService.cancelOrder).toHaveBeenCalledWith('user-1', 'order-1');
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const result = await controller.updateStatus(mockUser, 'order-1', {
        status: OrderStatus.PAID,
      });
      expect(result.status).toEqual(OrderStatus.PAID);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith('user-1', 'order-1', {
        status: OrderStatus.PAID,
      });
    });
  });

  describe('pay', () => {
    it('should return snap token and redirect url for pending order', async () => {
      const result = await controller.pay(mockUser, 'order-1');
      expect(result).toEqual({
        token: 'snap-token-123',
        redirectUrl: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
        redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/snap-token-123',
        snapToken: 'snap-token-123',
        midtransOrderId: 'order-1',
      });
      expect(mockOrdersService.pay).toHaveBeenCalledWith('user-1', 'order-1');
    });
  });
});

