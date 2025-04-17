import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Get,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Liveblocks } from '@liveblocks/node';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';

let liveBlocks: Liveblocks;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    liveBlocks = new Liveblocks({
      secret: this.configService.get<string>('LIVEBLOCKS_SECRET_KEY') || '',
    });
  }

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: any }> {
    const result = await this.authService.register(createUserDto);

    // Set the JWT as a cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user: result.user };
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: any }> {
    const result = await this.authService.login(loginDto);

    // Set the JWT as a cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { user: result.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request & { user?: any }): any {
    return req.user;
  }

  @Public()
  @Post('liveblocks-auth')
  async liveblocksAuth(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const { room } = req.body;

    if (!room) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Check for authorization header
    const authHeader = req.headers.authorization;

    // If no auth header or invalid format, create a guest session
    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ') ||
      authHeader === 'Bearer null' ||
      authHeader === 'Bearer undefined'
    ) {
      // Create a guest session
      console.log('Creating guest session for Liveblocks');

      try {
        // Generate a random guest ID
        const guestId = `guest-${Math.random().toString(36).substring(2, 10)}`;

        // Create a guest session with Liveblocks
        const session = liveBlocks.prepareSession(guestId, {
          userInfo: { name: 'Guest User', picture: '' },
        });

        // Grant access to the room
        session.allow(room, session.FULL_ACCESS);

        // Get Liveblocks token
        const { status, body } = await session.authorize();
        return res.status(status).send(body);
      } catch (error) {
        console.error('Guest Liveblocks auth error:', error);
        return res
          .status(500)
          .json({ message: 'Failed to create guest session' });
      }
    }

    // Try authenticated session
    try {
      const token = authHeader.split(' ')[1];

      const user = await this.authService.getUserFromToken(token);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Set up Liveblocks session
      const userInfo = {
        name: user.name || 'Teammate',
        picture: user.imageUrl || '',
      };

      const session = liveBlocks.prepareSession(String(user._id), {
        userInfo,
      });

      // Grant user access to the room
      session.allow(room, session.FULL_ACCESS);

      const { status, body } = await session.authorize();
      return res.status(status).send(body);
    } catch (error) {
      console.error('Liveblocks auth error:', error);

      // Return a more detailed error for debugging
      if (error.message) {
        return res.status(401).json({
          message: 'Authentication failed',
          error: error.message,
        });
      }

      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  // Add a debug endpoint to check if email exists
  @Public()
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string): Promise<any> {
    try {
      const userExists = await this.authService.checkUserExists(email);
      return {
        exists: userExists,
        email,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error checking email:', error);
      return {
        exists: false,
        error: 'Error checking email',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Public()
  @Post('create-test-user')
  async createTestUser(): Promise<any> {
    try {
      // Check if test user already exists
      const email = 'test@example.com';
      const exists = await this.authService.checkUserExists(email);

      if (exists) {
        return {
          message: 'Test user already exists',
          email,
          success: true,
          action: 'skipped',
        };
      }

      // Create test user if it doesn't exist
      const testUser = {
        name: 'Test User',
        email,
        password: 'Password123',
        imageUrl: 'https://ui-avatars.com/api/?name=Test+User',
      };

      const result = await this.authService.register(testUser);

      return {
        message: 'Test user created successfully',
        email,
        userId: result.user._id,
        success: true,
        action: 'created',
      };
    } catch (error) {
      console.error('Error creating test user:', error);
      return {
        message: 'Failed to create test user',
        error: error.message,
        success: false,
      };
    }
  }
}
