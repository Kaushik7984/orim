import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    try {
      const user = await this.authService.validateUser(token);
      return { user };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 