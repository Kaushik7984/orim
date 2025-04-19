import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  createBoard(userId: string, dto: CreateBoardDto) {
    return this.boardModel.create({ title: dto.title, ownerId: userId });
  }

  getUserBoards(userId: string) {
    return this.boardModel.find({ ownerId: userId });
  }

  async getBoardById(boardId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async updateBoard(boardId: string, dto: UpdateBoardDto) {
    return this.boardModel.findByIdAndUpdate(boardId, dto, { new: true });
  }

  async deleteBoard(boardId: string) {
    return this.boardModel.findByIdAndDelete(boardId);
  }
}
