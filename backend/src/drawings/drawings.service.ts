import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Drawing, DrawingDocument } from './schemas/drawing.schema';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectModel(Drawing.name) private drawingModel: Model<DrawingDocument>,
  ) {}

  async create(createDrawingDto: any): Promise<Drawing> {
    const createdDrawing = new this.drawingModel(createDrawingDto);
    return createdDrawing.save();
  }

  async findAll(): Promise<Drawing[]> {
    return this.drawingModel.find().populate('author').exec();
  }

  async findOne(id: string): Promise<Drawing> {
    return this.drawingModel.findById(id).populate('author').exec();
  }

  async update(id: string, updateDrawingDto: any): Promise<Drawing> {
    return this.drawingModel
      .findByIdAndUpdate(id, updateDrawingDto, { new: true })
      .populate('author')
      .exec();
  }

  async remove(id: string): Promise<Drawing> {
    return this.drawingModel.findByIdAndDelete(id).exec();
  }

  async likeDrawing(drawingId: string, userId: string): Promise<Drawing> {
    return this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $addToSet: { likes: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
  }

  async unlikeDrawing(drawingId: string, userId: string): Promise<Drawing> {
    return this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $pull: { likes: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
  }

  async addCollaborator(drawingId: string, userId: string): Promise<Drawing> {
    return this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $addToSet: { collaborators: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
  }

  async removeCollaborator(drawingId: string, userId: string): Promise<Drawing> {
    return this.drawingModel
      .findByIdAndUpdate(
        drawingId,
        { $pull: { collaborators: userId } },
        { new: true },
      )
      .populate('author')
      .exec();
  }
} 