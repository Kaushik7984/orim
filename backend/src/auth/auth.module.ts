import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
})
export class AuthModule {} 