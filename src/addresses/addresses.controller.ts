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
import { AddressesService } from './addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/auth.service.js';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({
    summary: 'Mendapatkan daftar alamat pengiriman milik pengguna yang sedang login',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar alamat berhasil diambil.',
  })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.addressesService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Mendapatkan detail alamat pengiriman berdasarkan ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik alamat (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail alamat ditemukan.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alamat tidak ditemukan.',
  })
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.addressesService.findOne(user.sub, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Menambahkan alamat pengiriman baru untuk pengguna',
  })
  @ApiResponse({
    status: 201,
    description: 'Alamat baru berhasil disimpan.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validasi form alamat gagal.',
  })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Memperbarui data alamat pengiriman',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik alamat (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat berhasil diperbarui.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alamat tidak ditemukan.',
  })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus alamat pengiriman',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unik alamat (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat berhasil dihapus.',
  })
  @ApiResponse({
    status: 404,
    description: 'Alamat tidak ditemukan.',
  })
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.addressesService.remove(user.sub, id);
  }
}
