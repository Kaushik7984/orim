import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drawing, DrawingDocument } from './schemas/drawing.schema';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectModel(Drawing.name) private drawingModel: Model<DrawingDocument>,
  ) {}

  async findById(id: string): Promise<Drawing> {
    const drawing = await this.drawingModel.findById(id).populate('author').exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }

  async findByAuthor(authorId: string): Promise<Drawing[]> {
    return this.drawingModel.find({ author: authorId }).populate('author').exec();
  }

  async create(createDrawingDto: any): Promise<Drawing> {
    const createdDrawing = new this.drawingModel(createDrawingDto);
    return createdDrawing.save();
  }

  async update(id: string, updateDrawingDto: any): Promise<Drawing> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(id, updateDrawingDto, { new: true })
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }

  async remove(id: string): Promise<Drawing> {
    const drawing = await this.drawingModel.findByIdAndDelete(id).exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }
} 