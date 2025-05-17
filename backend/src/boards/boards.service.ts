import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Board } from "./schemas/board.schema";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  // Create a new board
  async createBoard(userId: string, userEmail: string, dto: CreateBoardDto) {
    return this.boardModel.create({
      title: dto.title,
      ownerId: userId,
      ownerEmail: userEmail,
      collaborators: [],
      canvasData: {},
    });
  }

  // Get all boards for a user (including collaborated boards)
  getUserBoards(userEmail: string) {
    return this.boardModel
      .find({
        $or: [{ ownerEmail: userEmail }, { collaborators: userEmail }],
      })
      .sort({ createdAt: -1 });
  }

  // Get starred boards for a user
  getStarredBoards(userEmail: string) {
    return this.boardModel
      .find({
        $or: [
          { ownerEmail: userEmail, isStarred: true },
          { collaborators: userEmail, isStarred: true },
        ],
      })
      .sort({ createdAt: -1 });
  }

  // Get a specific board by ID
  async getBoardById(boardId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");
    return board;
  }

  // Find a board by ID (lean for better performance)
  async findBoardById(boardId: string) {
    const board = await this.boardModel.findById(boardId).lean();
    if (!board) throw new NotFoundException("Board not found");
    return board;
  }

  // Toggle star status for a board
  async toggleStarBoard(boardId: string) {
    const board = await this.boardModel.findByIdAndUpdate(
      boardId,
      [{ $set: { isStarred: { $not: "$isStarred" } } }],
      { new: true }
    );
    if (!board) throw new NotFoundException("Board not found");
    return board;
  }

  // Update a board
  async updateBoard(boardId: string, dto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");

    if (dto.canvasData && typeof dto.canvasData !== "object") {
      throw new BadRequestException("Invalid canvas data format");
    }

    // Update title if provided
    if (dto.title) {
      board.title = dto.title;
    }

    // Update canvasData and other properties if provided
    if (dto.canvasData) {
      board.canvasData = dto.canvasData;
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

  // Add a collaborator to a board
  async addCollaborator(boardId: string, collaboratorId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");

    // Initialize collaborators array if it doesn't exist
    if (!board.collaborators) {
      board.collaborators = [];
    }

    // Check if collaborator is already in the array
    if (!board.collaborators.includes(collaboratorId)) {
      board.collaborators.push(collaboratorId);
      await board.save();
    }
    return board;
  }

  // Remove a collaborator from a board
  async removeCollaborator(boardId: string, collaboratorId: string) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException("Board not found");

    // Initialize collaborators array if it doesn't exist
    if (!board.collaborators) {
      board.collaborators = [];
    }

    board.collaborators = board.collaborators.filter(
      (id) => id !== collaboratorId
    );
    await board.save();
    return board;
  }
}
