import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedModule } from '../shared/shared.module';
import { FirebaseModule } from '../config/firebase.module';
import { FirebaseAuthGuard } from './guards/firebase.guard';

@Module({
  imports: [SharedModule, FirebaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
