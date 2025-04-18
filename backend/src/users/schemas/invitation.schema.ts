import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User, UserDocument } from './user.schema';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  boardId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  invitedBy: UserDocument;

  @Prop()
  message?: string;

  @Prop({
    type: String,
    enum: Object.values(InvitationStatus),
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Prop()
  expiresAt?: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
