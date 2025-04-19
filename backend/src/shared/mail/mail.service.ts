import { Injectable, Logger } from '@nestjs/common';
import { InvitationDocument } from '../../users/schemas/invitation.schema';
import * as nodemailer from 'nodemailer';

// Define a type for the email info
interface EmailInfo {
  messageId?: string;
  [key: string]: any;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Use the correct environment variables
    const smtpHost = process.env.MAIL_HOST;
    const smtpPort = process.env.MAIL_PORT;
    const smtpUser = process.env.MAIL_USER;
    const smtpPass = process.env.MAIL_PASS;
    const mailFrom = process.env.MAIL_FROM;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error('Missing required SMTP configuration');
    }

    this.logger.log(
      `Initializing mail service with host: ${smtpHost}:${smtpPort}`,
    );

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      debug: true, // Enable debug output
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error: unknown) {
      this.logger.error('SMTP connection verification failed:', error);
      throw new Error('Failed to connect to SMTP server');
    }
  }

  async sendInvitationEmail(invitation: InvitationDocument): Promise<void> {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const mailFrom = process.env.MAIL_FROM || process.env.MAIL_USER;

      if (!mailFrom) {
        throw new Error('Missing mail from configuration');
      }

      // Ensure invitation._id is a string
      const invitationId = String(invitation._id);

      this.logger.log(
        `Preparing to send invitation email to ${invitation.email} for board ${invitation.boardId}`,
      );

      const mailOptions = {
        from: mailFrom,
        to: invitation.email,
        subject: "You've been invited to collaborate on a board",
        text: `You've been invited to collaborate on a board. Click here to accept: ${frontendUrl}/board/session/123456`,
        html: `
          <h1>Board Invitation</h1>
          <p>You've been invited to collaborate on a board.</p>
          <a href="${frontendUrl}/board/session/123456" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
            Accept Invitation
          </a>
        `,
      };

      this.logger.log('Sending email with options:', {
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject,
      });

      // Use the custom EmailInfo type
      const info = (await this.transporter.sendMail(mailOptions)) as EmailInfo;
      const messageId = info.messageId || 'unknown';
      this.logger.log(
        `Invitation email sent successfully to ${invitation.email}. Message ID: ${messageId}`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send invitation email to ${invitation.email}:`,
        error,
      );
      throw error;
    }
  }
}
