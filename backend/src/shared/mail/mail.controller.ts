import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../../shared/mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('invite')
  async sendInvite(
    @Body() body: { email: string; boardId: string; message?: string },
  ) {
    const { email, boardId, message } = body;
    await this.mailService.sendBoardInvite(email, boardId, message);
    return { message: 'Invitation sent' };
  }
}
