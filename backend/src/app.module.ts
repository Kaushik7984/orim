import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { FirebaseModule } from './config/firebase.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    FirebaseModule,
    AuthModule,
    BoardsModule,
    SharedModule,
  ],
})
export class AppModule {}
