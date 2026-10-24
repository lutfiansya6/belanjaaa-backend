import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service.js';
import { MidtransWebhookDto } from './dto/midtrans-webhook.dto.js';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )
  @ApiOperation({
    summary:
      'Webhook handler notifikasi transaksi pembayaran dari Midtrans (Idempoten & verifikasi signature_key)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Notifikasi berhasil diproses atau diabaikan secara idempoten jika duplikat.',
  })
  @ApiResponse({
    status: 400,
    description: 'Signature key tidak valid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pesanan tidak ditemukan.',
  })
  handleWebhook(@Body() payload: MidtransWebhookDto) {
    return this.paymentsService.handleWebhook(payload);
  }
}
