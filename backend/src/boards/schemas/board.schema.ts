import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  ownerEmail: string;

  @Prop({ type: [String], default: [] })
  collaborators: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  canvasData: object;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
