import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase.config';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async validateUser(token: string) {
    try {
      return await this.firebaseService.auth.verifyIdToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
