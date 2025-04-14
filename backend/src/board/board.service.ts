import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './board.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(title: string) {
    return this.boardModel.create({ title });
  }

  async findAll() {
    return this.boardModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.boardModel.findById(id);
  }

  async update(id: string, data: any) {
    return this.boardModel.findByIdAndUpdate(id, { data }, { new: true });
  }
}
