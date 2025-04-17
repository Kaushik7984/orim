import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('drawings')
@UseGuards(JwtAuthGuard)
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Post()
  create(@Body() createDrawingDto: any, @Req() req: any) {
    return this.drawingsService.create({
      ...createDrawingDto,
      author: req.user._id,
    });
  }

  @Get()
  findAll() {
    return this.drawingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drawingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDrawingDto: any) {
    return this.drawingsService.update(id, updateDrawingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drawingsService.remove(id);
  }

  @Post(':id/like')
  likeDrawing(@Param('id') id: string, @Req() req: any) {
    return this.drawingsService.likeDrawing(id, req.user._id);
  }

  @Post(':id/unlike')
  unlikeDrawing(@Param('id') id: string, @Req() req: any) {
    return this.drawingsService.unlikeDrawing(id, req.user._id);
  }

  @Post(':id/collaborators')
  addCollaborator(@Param('id') id: string, @Body('userId') userId: string) {
    return this.drawingsService.addCollaborator(id, userId);
  }

  @Delete(':id/collaborators/:userId')
  removeCollaborator(@Param('id') id: string, @Param('userId') userId: string) {
    return this.drawingsService.removeCollaborator(id, userId);
  }
} 