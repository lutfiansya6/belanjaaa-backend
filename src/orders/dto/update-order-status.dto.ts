import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Status baru pesanan',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  @IsEnum(OrderStatus, {
    message:
      'Status order harus salah satu dari: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED',
  })
  @IsNotEmpty({ message: 'Status order wajib diisi' })
  status: OrderStatus;
}
