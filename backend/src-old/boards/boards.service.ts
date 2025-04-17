import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Board | null> {
    return this.boardModel.findById(id);
  }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const created = new this.boardModel({ ...createBoardDto, data: {} });
    return created.save();
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board | null> {
    return this.boardModel.findByIdAndUpdate(id, updateBoardDto, { new: true });
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    await this.boardModel.findByIdAndDelete(id);
    return { deleted: true };
  }
}
