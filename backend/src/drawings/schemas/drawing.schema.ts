import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

export type DrawingDocument = Drawing & Document;

@Schema({ timestamps: true })
export class Drawing {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: Types.ObjectId[];

  @Prop({ type: [Object], default: [] })
  paths: any[];
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing); 