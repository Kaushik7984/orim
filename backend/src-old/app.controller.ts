import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello() {
    return {
      status: 'ok',
      message: 'NestJS API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    };
  }
}
