import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService, private readonly usersService: UsersService) {
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not defined');
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseApp.auth().verifyIdToken(token);
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decodedToken = await this.verifyToken(token);
      const user = await this.usersService.findByFirebaseUid(decodedToken.uid);
      
      if (!user) {
        // Create new user if doesn't exist
        return this.usersService.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || '',
        });
      }
      
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 