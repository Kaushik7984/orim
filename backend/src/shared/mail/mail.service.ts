import { Injectable, Logger } from '@nestjs/common';
import { InvitationDocument } from '../../users/schemas/invitation.schema';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  sendInvitationEmail(invitation: InvitationDocument): void {
    // In a real application, you would use a mail service like SendGrid, AWS SES, etc.
    // For now, we'll just log the invitation
    this.logger.log(
      `Sending invitation email to ${invitation.email} for board ${invitation.boardId}`,
    );

    // Simulate sending an email
    this.logger.log(`Invitation email sent to ${invitation.email}`);
  }
}
