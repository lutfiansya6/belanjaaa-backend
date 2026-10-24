import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MidtransWebhookDto {
  @ApiProperty({ description: 'ID pesanan Midtrans', example: 'order-123' })
  @IsString()
  @IsNotEmpty()
  order_id!: string;

  @ApiProperty({ description: 'Kode status HTTP dari Midtrans', example: '200' })
  @IsString()
  @IsNotEmpty()
  status_code!: string;

  @ApiProperty({ description: 'Total nilai transaksi', example: '150000.00' })
  @IsString()
  @IsNotEmpty()
  gross_amount!: string;

  @ApiProperty({
    description: 'SHA512 signature key untuk memverifikasi keaslian notifikasi',
    example: 'a1b2c3d4...',
  })
  @IsString()
  @IsNotEmpty()
  signature_key!: string;

  @ApiProperty({
    description: 'Status transaksi: settlement, capture, pending, deny, cancel, expire',
    example: 'settlement',
  })
  @IsString()
  @IsNotEmpty()
  transaction_status!: string;

  @ApiPropertyOptional({
    description: 'Status fraud untuk pembayaran kartu kredit (accept, challenge, deny)',
    example: 'accept',
  })
  @IsString()
  @IsOptional()
  fraud_status?: string;

  @ApiPropertyOptional({
    description: 'Metode pembayaran (bank_transfer, qris, gopay, cstore, dll.)',
    example: 'bank_transfer',
  })
  @IsString()
  @IsOptional()
  payment_type?: string;

  @ApiPropertyOptional({ description: 'ID transaksi internal Midtrans' })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiPropertyOptional({ description: 'Waktu transaksi' })
  @IsString()
  @IsOptional()
  transaction_time?: string;

  @ApiPropertyOptional({ description: 'Status message Midtrans' })
  @IsString()
  @IsOptional()
  status_message?: string;

  // Allow any extra fields from Midtrans
  [key: string]: any;
}
