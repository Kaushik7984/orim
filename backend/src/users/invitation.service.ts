/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Invitation,
  InvitationDocument,
  InvitationStatus,
} from './schemas/invitation.schema';
import { User, UserDocument } from './schemas/user.schema';
import { InviteUserDto } from './dto/invite-user.dto';
import { MailService } from '../shared/mail/mail.service';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async createInvitation(
    inviteUserDto: InviteUserDto,
    invitedBy: UserDocument,
  ): Promise<InvitationDocument> {
    const existingInvitation = await this.invitationModel.findOne({
      email: inviteUserDto.email,
      boardId: inviteUserDto.boardId,
      status: InvitationStatus.PENDING,
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation already exists');
    }

    const invitation = new this.invitationModel({
      ...inviteUserDto,
      invitedBy: invitedBy._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
    });

    await invitation.save();

    try {
      this.mailService.sendInvitationEmail(invitation);
    } catch (error) {
      this.logger.error('Failed to send invitation email:', error);
    }

    return invitation;
  }

  async acceptInvitation(
    invitationId: string,
    user: UserDocument,
  ): Promise<InvitationDocument> {
    const invitation = await this.invitationModel.findById(invitationId);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation has expired');
    }

    invitation.status = InvitationStatus.ACCEPTED;
    return invitation.save();
  }

  async getInvitations(user: UserDocument): Promise<InvitationDocument[]> {
    return this.invitationModel
      .find({
        email: user.email,
      })
      .populate('invitedBy')
      .exec();
  }

  async getPendingInvitations(email: string): Promise<InvitationDocument[]> {
    return this.invitationModel
      .find({
        email,
        status: InvitationStatus.PENDING,
      })
      .populate('invitedBy')
      .exec();
  }
}
