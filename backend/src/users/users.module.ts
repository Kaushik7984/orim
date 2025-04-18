import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { SharedModule } from '../shared/shared.module';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    forwardRef(() => SharedModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, InvitationController],
  providers: [UsersService, InvitationService],
  exports: [UsersService, InvitationService],
})
export class UsersModule {}
