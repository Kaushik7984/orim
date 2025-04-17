import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:boardId')
  toggleFavorite(
    @Req() req: AuthenticatedRequest,
    @Param('boardId') boardId: string,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.usersService.toggleFavorite(userId, boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('organizations/:orgId')
  addToOrganization(
    @Req() req: AuthenticatedRequest,
    @Param('orgId') orgId: string,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.usersService.addToOrganization(userId, orgId);
  }
}
