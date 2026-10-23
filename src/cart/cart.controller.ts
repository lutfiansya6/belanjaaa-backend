import {
  Body,
  Controller,
  Delete,
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
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/auth.service.js';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Mendapatkan data keranjang belanja milik pengguna saat ini',
  })
  @ApiResponse({
    status: 200,
    description: 'Data keranjang belanja berhasil diambil.',
  })
  @ApiResponse({
    status: 401,
    description: 'Pengguna belum terautentikasi.',
  })
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getCart(user.sub);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Menambahkan produk ke dalam keranjang belanja',
  })
  @ApiResponse({
    status: 201,
    description: 'Produk berhasil ditambahkan ke keranjang.',
  })
  @ApiResponse({
    status: 400,
    description: 'Stok produk tidak mencukupi atau input tidak valid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Produk tidak ditemukan.',
  })
  addToCart(@CurrentUser() user: JwtPayload, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.sub, dto);
  }

  @Patch('items/:id')
  @ApiOperation({
    summary: 'Mengubah kuantitas item produk di dalam keranjang belanja',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik cart item (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Kuantitas item keranjang berhasil diperbarui.',
  })
  @ApiResponse({
    status: 400,
    description: 'Kuantitas melebihi stok yang tersedia.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item keranjang tidak ditemukan.',
  })
  updateQuantity(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(user.sub, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: 'Menghapus item tertentu dari keranjang belanja',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik cart item (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Item keranjang berhasil dihapus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item keranjang tidak ditemukan.',
  })
  removeItem(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.cartService.removeItem(user.sub, id);
  }

  @Delete()
  @ApiOperation({
    summary: 'Mengosongkan seluruh isi keranjang belanja pengguna',
  })
  @ApiResponse({
    status: 200,
    description: 'Seluruh isi keranjang berhasil dikosongkan.',
  })
  clearCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.clearCart(user.sub);
  }
}
