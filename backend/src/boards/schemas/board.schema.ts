import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true }) // This automatically adds `createdAt` and `updatedAt` fields.
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  ownerEmail: string;

  @Prop({ type: Object, default: {} })
  content: any; // This will store additional content if needed (like board metadata)

  @Prop({ type: [String], default: [] })
  collaborators: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  canvasData: any; // Store canvas data (drawing state)

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
