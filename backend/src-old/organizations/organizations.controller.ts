import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.create(createOrganizationDto, userId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.findAll(userId);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<any> {
    return this.organizationsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.organizationsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.update(id, updateOrganizationDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.remove(id, userId);
  }

  @Post(':id/members/:memberId')
  addMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.addMember(id, memberId, userId);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.organizationsService.removeMember(id, memberId, userId);
  }
}
