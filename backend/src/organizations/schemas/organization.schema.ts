import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ default: [] })
  members: string[]; // Array of user IDs
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
