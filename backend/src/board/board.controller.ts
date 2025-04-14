import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Post()
  create(@Body('title') title: string) {
    return this.boardService.create(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('data') data: any) {
    return this.boardService.update(id, data);
  }
}
