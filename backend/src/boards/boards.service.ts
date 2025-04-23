import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  // Create a new board
  async createBoard(userId: string, userEmail: string, dto: CreateBoardDto) {
    return this.boardModel.create({
      title: dto.title,
      ownerId: userId,
      ownerEmail: userEmail,
    });
  }

  // Get all boards for a user
  getUserBoards(userId: string) {
    return this.boardModel.find({ ownerId: userId });
  }

  // Get a specific board by ID
  async getBoardById(boardId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  // Find a board by ID (lean for better performance)
  async findBoardById(boardId: string) {
    const board = await this.boardModel.findById(boardId).lean();
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  // Update a board
  async updateBoard(boardId: string, dto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    // Ensure canvasData is valid
    if (dto.canvasData && typeof dto.canvasData !== 'object') {
      throw new BadRequestException('Invalid canvas data format');
    }

    // Update canvasData if provided
    if (dto.canvasData) {
      board.canvasData = dto.canvasData;
    }

    // Save the updated board
    return await board.save();
  }

  // Delete a board
  async deleteBoard(boardId: string) {
    return this.boardModel.findByIdAndDelete(boardId);
  }
}
