import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Object, default: {} })
  data: any;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
