import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<UserDocument> {
    this.logger.log(`Finding user by ID: ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument> {
    this.logger.log(`Finding user by Firebase UID: ${firebaseUid}`);
    const user = await this.userModel.findOne({ firebaseUid }).exec();
    if (!user) {
      this.logger.warn(`User with Firebase UID ${firebaseUid} not found`);
      throw new NotFoundException(
        `User with Firebase UID ${firebaseUid} not found`,
      );
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log('Creating new user:', createUserDto);
    try {
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      this.logger.log('User created successfully:', savedUser);
      return savedUser;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    return this.userModel.find().exec();
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserDocument> {
    this.logger.log(`Updating user ${id}:`, updateUserDto);
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<UserDocument> {
    this.logger.log(`Removing user ${id}`);
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
