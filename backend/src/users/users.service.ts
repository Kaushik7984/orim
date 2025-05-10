import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByFirebaseUid(uid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ firebaseUid: uid });
    if (!user) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }
}
