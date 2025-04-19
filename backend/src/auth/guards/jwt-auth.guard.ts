import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    this.logger.log(
      `Authorization header: ${request.headers.authorization ? 'Present' : 'Missing'}`,
    );

    if (!token) {
      this.logger.warn('No token found in request');
      return false;
    }

    this.logger.log(`Token extracted: ${token.substring(0, 10)}...`);

    try {
      const user = await this.authService.validateUser(token);
      request.user = user;
      this.logger.log(`User authenticated: ${user.email}`);
      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    this.logger.log(`Auth type: ${type}, Token present: ${!!token}`);
    return type === 'Bearer' ? token : undefined;
  }
}
