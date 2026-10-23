import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/auth.service.js';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary:
      'Membuat pesanan baru dari isi keranjang belanja (transaksi database dengan validasi & pemotongan stok)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Pesanan berhasil dibuat, stok produk terpotong, dan keranjang belanja dikosongkan.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Keranjang belanja kosong atau stok produk tidak mencukupi untuk memenuhi pesanan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produk atau alamat pengiriman tidak ditemukan.',
  })
  createFromCart(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createFromCart(user.sub, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Mendapatkan seluruh riwayat pesanan milik pengguna yang sedang login',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar pesanan pengguna berhasil diambil.',
  })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.ordersService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Mendapatkan detail pesanan berdasarkan ID pesanan',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik pesanan (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail pesanan ditemukan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pesanan tidak ditemukan.',
  })
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findOne(user.sub, id);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary:
      'Membatalkan pesanan (hanya untuk status PENDING) dan mengembalikan stok produk ke etalase',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik pesanan (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pesanan berhasil dibatalkan dan stok produk telah dikembalikan.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Pesanan tidak dapat dibatalkan karena status bukan lagi PENDING.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pesanan tidak ditemukan.',
  })
  cancelOrder(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.cancelOrder(user.sub, id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary:
      'Memperbarui status pesanan (PENDING, PAID, SHIPPED, COMPLETED, CANCELLED)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik pesanan (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Status pesanan berhasil diperbarui.',
  })
  @ApiResponse({
    status: 400,
    description: 'Status tidak valid atau transisi tidak diperbolehkan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Pesanan tidak ditemukan.',
  })
  updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(user.sub, id, dto);
  }
}
