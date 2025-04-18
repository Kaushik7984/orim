import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from './schemas/user.schema';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  async createInvitation(
    @Body() inviteUserDto: InviteUserDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.invitationService.createInvitation(inviteUserDto, user);
  }

  @Post(':id/accept')
  async acceptInvitation(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.invitationService.acceptInvitation(id, user);
  }

  @Get()
  async getMyInvitations(@CurrentUser() user: UserDocument) {
    return this.invitationService.getInvitations(user);
  }

  @Get('pending')
  async getPendingInvitations(@CurrentUser() user: UserDocument) {
    return this.invitationService.getPendingInvitations(user.email);
  }
}
