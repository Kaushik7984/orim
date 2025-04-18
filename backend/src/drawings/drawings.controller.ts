import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { DrawingContent } from './interfaces/drawing-content.interface';

@Controller('drawings')
@UseGuards(JwtAuthGuard)
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Post()
  async create(
    @Body() createDrawingDto: CreateDrawingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.drawingsService.create(createDrawingDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserDocument) {
    return this.drawingsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.drawingsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDrawingDto: UpdateDrawingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.drawingsService.update(id, updateDrawingDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.drawingsService.remove(id, user);
  }

  @Post(':id/collaborators/:userId')
  async addCollaborator(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.drawingsService.addCollaborator(id, userId, user);
  }

  @Delete(':id/collaborators/:userId')
  async removeCollaborator(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.drawingsService.removeCollaborator(id, userId, user);
  }

  @Patch(':id/content')
  async updateContent(
    @Param('id') id: string,
    @Body('content') content: DrawingContent,
    @CurrentUser() user: UserDocument,
  ) {
    return this.drawingsService.updateContent(id, content, user);
  }
}
