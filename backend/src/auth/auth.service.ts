import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
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