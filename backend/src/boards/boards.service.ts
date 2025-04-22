import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  // Update a board (make sure canvasData is properly updated)
  async updateBoard(boardId: string, dto: UpdateBoardDto, userId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    // Check if the user is the owner or a collaborator
    if (board.ownerId !== userId && !board.collaborators.includes(userId)) {
      throw new UnauthorizedException(
        'You do not have permission to update this board',
      );
    }

    // Update the content if provided
    if (dto.content) {
      board.content = dto.content;
    }

    // Update canvas data if provided
    if (dto.canvasData) {
      board.canvasData = dto.canvasData;
    }

    if (dto.title !== undefined) {
      board.title = dto.title;
    }

    if (dto.collaborators !== undefined) {
      board.collaborators = dto.collaborators;
    }

    await board.save(); // Save the updated board state
    return board;
  }

  // Delete a board
  async deleteBoard(boardId: string) {
    return this.boardModel.findByIdAndDelete(boardId);
  }
}
