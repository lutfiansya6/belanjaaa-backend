import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Cek status kesehatan API' })
  @ApiResponse({ status: 200, description: 'API berjalan dengan normal' })
  getHealth() {
    return this.appService.getHealth();
  }
}
