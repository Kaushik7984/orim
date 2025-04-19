import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import admin from '../config/firebase.config';

// Define the CreateUserDto interface to match what UsersService expects
interface CreateUserDto {
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(token: string): Promise<UserDocument> {
    try {
      console.log('Validating token:', token.substring(0, 10) + '...');
      const decodedToken = await this.verifyToken(token);
      console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

      try {
        // Try to find the user
        const user = await this.usersService.findByFirebaseUid(
          decodedToken.uid,
        );
        console.log('Found existing user:', user);
        return user;
      } catch (error) {
        console.error('Error finding user:', error);
        // If user not found, create a new one
        console.log(
          'User not found, creating new user with uid:',
          decodedToken.uid,
        );
        const newUser: CreateUserDto = {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || '',
          name:
            (decodedToken.name as string) ||
            (decodedToken.email as string)?.split('@')[0] ||
            'User',
          avatar: decodedToken.picture || undefined,
          isAdmin: false,
        };

        const createdUser = await this.usersService.create(newUser);
        console.log('Created new user:', createdUser);
        return createdUser;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      console.log('Verifying token with Firebase...');
      console.log('Token length:', token.length);
      console.log(
        'Token format check:',
        token.includes('.') ? 'Looks like a JWT' : 'Not a JWT format',
      );

      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token verification successful');
      return decodedToken;
    } catch (error) {
      console.error('Token verification failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new UnauthorizedException('Invalid token');
    }
  }
}
