import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';
import { Drawing, DrawingSchema } from './schemas/drawing.schema';
import { DrawingGateway } from './drawing.gateway';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drawing.name, schema: DrawingSchema }]),
    forwardRef(() => SharedModule),
  ],
  controllers: [DrawingsController],
  providers: [DrawingsService, DrawingGateway],
  exports: [DrawingsService],
})
export class DrawingsModule {} 