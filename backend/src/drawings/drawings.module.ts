import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';
import { Drawing, DrawingSchema } from './schemas/drawing.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drawing.name, schema: DrawingSchema }]),
    AuthModule,
  ],
  controllers: [DrawingsController],
  providers: [DrawingsService],
  exports: [DrawingsService],
})
export class DrawingsModule {}
