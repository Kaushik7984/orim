import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBoardDto) {
    return this.boardsService.createBoard(user.uid, user.email, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.boardsService.getUserBoards(user.uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.getBoardById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
    @CurrentUser() user: any,
  ) {
    return this.boardsService.updateBoard(id, dto, user.uid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.deleteBoard(id);
  }
}
