import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { BoardsModule } from './boards/boards.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => BoardsModule),
    SharedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
