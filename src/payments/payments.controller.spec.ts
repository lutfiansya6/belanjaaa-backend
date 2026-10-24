import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockWebhookResult = {
    success: true,
    message: 'Notification processed successfully',
    orderId: 'order-1',
    orderStatus: 'PAID',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            handleWebhook: vi.fn().mockResolvedValue(mockWebhookResult),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleWebhook', () => {
    it('should forward webhook payload to PaymentsService', async () => {
      const payload = {
        order_id: 'order-1',
        status_code: '200',
        gross_amount: '150000.00',
        signature_key: 'test-signature',
        transaction_status: 'settlement',
      };

      const result = await controller.handleWebhook(payload);
      expect(result).toEqual(mockWebhookResult);
      expect(service.handleWebhook).toHaveBeenCalledWith(payload);
    });
  });
});
