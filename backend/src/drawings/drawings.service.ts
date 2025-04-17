import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drawing, DrawingDocument } from './schemas/drawing.schema';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectModel(Drawing.name) private drawingModel: Model<DrawingDocument>,
  ) {}

  async findAll(): Promise<DrawingDocument[]> {
    return this.drawingModel.find().populate('author').exec();
  }

  async findOne(id: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel.findById(id).populate('author').exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }

  async findByAuthor(authorId: string): Promise<DrawingDocument[]> {
    return this.drawingModel.find({ author: authorId }).populate('author').exec();
  }

  async create(createDrawingDto: any): Promise<DrawingDocument> {
    const createdDrawing = new this.drawingModel(createDrawingDto);
    return createdDrawing.save();
  }

  async update(id: string, updateDrawingDto: any): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(id, updateDrawingDto, { new: true })
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }

  async remove(id: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel.findByIdAndDelete(id).exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${id} not found`);
    }
    return drawing;
  }

  async likeDrawing(drawingId: string, userId: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $addToSet: { likes: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${drawingId} not found`);
    }
    return drawing;
  }

  async unlikeDrawing(drawingId: string, userId: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $pull: { likes: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${drawingId} not found`);
    }
    return drawing;
  }

  async addCollaborator(drawingId: string, userId: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $addToSet: { collaborators: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${drawingId} not found`);
    }
    return drawing;
  }

  async removeCollaborator(drawingId: string, userId: string): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $pull: { collaborators: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
    if (!drawing) {
      throw new NotFoundException(`Drawing with ID ${drawingId} not found`);
    }
    return drawing;
  }
} 