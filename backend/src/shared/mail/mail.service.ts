import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly mailFrom: string;

  constructor() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_MAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error('Missing SMTP config');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    this.transporter
      .verify()
      .then(() => {
        this.logger.log('Mail server connection verified.');
      })
      .catch((err) => {
        this.logger.error('SMTP connection failed:', err);
      });
  }

  async sendBoardInvite(
    email: string,
    boardId: string,
    message?: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL;
    const joinUrl = `${frontendUrl}/board/${boardId}`;
    const manualJoinUrl = `${frontendUrl}/board/join-board`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">You've been invited to collaborate on a whiteboard</h2>
      ${message ? `<p style="margin-top: 10px;">${message}</p>` : ''}
      <p style="margin-top: 20px;">Click the button below to join the board directly:</p>
      <a href="${joinUrl}" 
         style="display: inline-block; margin: 10px 0; padding: 12px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
        Join Board
      </a>
      <hr style="margin: 30px 0;" />
      <p style="margin-bottom: 5px;">Or, if the button doesn't work, use this Board ID to join manually:</p>
      <p style="font-weight: bold; font-size: 16px; color: #2563eb;">${boardId}</p>
      <p style="margin-top: 5px;">Go to <a href="${manualJoinUrl}">${manualJoinUrl}</a> and paste the Board ID to join.</p>
    </div>
  `;

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'You’ve been invited to a collaborative whiteboard',
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Board invite sent to ${email}`);
  }
}
