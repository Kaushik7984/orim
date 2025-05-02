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
      content: {}, // Initialize content
      collaborators: [], // Initialize collaborators
      canvasData: {}, // Initialize canvasData
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

    if (dto.canvasData && typeof dto.canvasData !== 'object') {
      throw new BadRequestException('Invalid canvas data format');
    }

    // Update canvasData and other properties if provided
    if (dto.canvasData) {
      board.canvasData = dto.canvasData;
    }

    if (dto.content) {
      board.content = dto.content;
    }

    if (dto.collaborators) {
      board.collaborators = dto.collaborators;
    }

    return await board.save();
  }

  // Delete a board
  async deleteBoard(boardId: string) {
    return this.boardModel.findByIdAndDelete(boardId);
  }
}
