import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

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
  author: User;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: User[];
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing); 