import { Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';

@Module({
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class SharedModule {}
