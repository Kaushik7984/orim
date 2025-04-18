import { UserDocument } from '../schemas/user.schema';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Invitation {
  id: string;
  email: string;
  boardId: string;
  invitedBy: UserDocument;
  message?: string;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt?: Date;
}
