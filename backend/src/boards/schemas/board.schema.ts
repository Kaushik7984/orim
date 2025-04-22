import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  ownerEmail: string;

  @Prop({ type: Object, default: {} })
  content: any;

  @Prop({ type: [String], default: [] })
  collaborators: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
