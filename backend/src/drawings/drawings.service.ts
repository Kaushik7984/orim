import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Drawing, DrawingDocument } from './schemas/drawing.schema';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { DrawingContent } from './interfaces/drawing-content.interface';

@Injectable()
export class DrawingsService {
  constructor(
    @InjectModel(Drawing.name) private drawingModel: Model<DrawingDocument>,
  ) {}

  async create(
    createDrawingDto: CreateDrawingDto,
    user: UserDocument,
  ): Promise<DrawingDocument> {
    const createdDrawing = new this.drawingModel({
      ...createDrawingDto,
      owner: user._id,
    });
    return createdDrawing.save();
  }

  async findAll(user: UserDocument): Promise<DrawingDocument[]> {
    return this.drawingModel
      .find({
        $or: [{ owner: user._id }, { collaborators: user._id }],
      })
      .exec();
  }

  async findOne(id: string, user: UserDocument): Promise<DrawingDocument> {
    const drawing = await this.drawingModel
      .findOne({
        _id: id,
        $or: [{ owner: user._id }, { collaborators: user._id }],
      })
      .exec();

    if (!drawing) {
      throw new NotFoundException(`Drawing with ID "${id}" not found`);
    }

    return drawing;
  }

  async update(
    id: string,
    updateDrawingDto: UpdateDrawingDto,
    user: UserDocument,
  ): Promise<DrawingDocument> {
    const drawing = await this.findOne(id, user);

    if (drawing.owner.toString() !== user._id.toString()) {
      throw new NotFoundException(
        'You do not have permission to update this drawing',
      );
    }

    Object.assign(drawing, updateDrawingDto);
    return drawing.save();
  }

  async remove(id: string, user: UserDocument): Promise<void> {
    const drawing = await this.findOne(id, user);

    if (drawing.owner.toString() !== user._id.toString()) {
      throw new NotFoundException(
        'You do not have permission to delete this drawing',
      );
    }

    await this.drawingModel.deleteOne({ _id: id }).exec();
  }

  async addCollaborator(
    id: string,
    collaboratorId: string,
    user: UserDocument,
  ): Promise<DrawingDocument> {
    const drawing = await this.findOne(id, user);

    if (drawing.owner.toString() !== user._id.toString()) {
      throw new NotFoundException(
        'You do not have permission to add collaborators to this drawing',
      );
    }

    if (drawing.collaborators.includes(new Types.ObjectId(collaboratorId))) {
      throw new NotFoundException('User is already a collaborator');
    }

    drawing.collaborators.push(new Types.ObjectId(collaboratorId));
    return drawing.save();
  }

  async removeCollaborator(
    id: string,
    collaboratorId: string,
    user: UserDocument,
  ): Promise<DrawingDocument> {
    const drawing = await this.findOne(id, user);

    if (drawing.owner.toString() !== user._id.toString()) {
      throw new NotFoundException(
        'You do not have permission to remove collaborators from this drawing',
      );
    }

    const collaboratorIndex = drawing.collaborators.findIndex(
      (id) => id.toString() === collaboratorId,
    );

    if (collaboratorIndex === -1) {
      throw new NotFoundException('User is not a collaborator');
    }

    drawing.collaborators.splice(collaboratorIndex, 1);
    return drawing.save();
  }

  async updateContent(
    id: string,
    content: DrawingContent,
    user: UserDocument,
  ): Promise<DrawingDocument> {
    const drawing = await this.findOne(id, user);

    if (
      drawing.owner.toString() !== user._id.toString() &&
      !drawing.collaborators.some((id) => id.toString() === user._id.toString())
    ) {
      throw new NotFoundException(
        'You do not have permission to update this drawing',
      );
    }

    drawing.content = content;
    return drawing.save();
  }
}
