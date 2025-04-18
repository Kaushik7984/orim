import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DrawingsModule } from './drawings/drawings.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URL ||
        process.env.MONGODB_URI ||
        'mongodb://localhost:27017/inspiro-draw',
    ),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => DrawingsModule),
  ],
  controllers: [AppController],
})
export class AppModule {}
