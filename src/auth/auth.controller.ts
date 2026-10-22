import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import type { JwtPayload } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrasi pengguna baru (default role: BUYER)',
  })
  @ApiResponse({
    status: 201,
    description: 'Registrasi berhasil dan mengembalikan access token serta data pengguna.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validasi input gagal.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email sudah terdaftar.',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login pengguna untuk mendapatkan access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil dan mengembalikan access token JWT.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validasi input gagal.',
  })
  @ApiResponse({
    status: 401,
    description: 'Email atau kata sandi tidak valid.',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mendapatkan profil pengguna yang sedang login',
  })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil profil pengguna saat ini.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token otentikasi tidak valid atau belum login.',
  })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
