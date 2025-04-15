import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    userId: string,
  ): Promise<OrganizationDocument> {
    // Check if organization with this slug already exists
    const existingOrg = await this.organizationModel
      .findOne({
        slug: createOrganizationDto.slug,
      })
      .exec();

    if (existingOrg) {
      throw new ConflictException('Organization with this slug already exists');
    }

    const newOrganization = new this.organizationModel({
      ...createOrganizationDto,
      creatorId: userId,
      members: [userId],
    });

    const savedOrg = await newOrganization.save();

    // Add user to organization
    await this.usersService.addToOrganization(userId, savedOrg._id.toString());

    return savedOrg;
  }

  async findAll(userId: string): Promise<OrganizationDocument[]> {
    return this.organizationModel
      .find({
        members: userId,
      })
      .sort({ name: 1 })
      .exec();
  }

  async findBySlug(slug: string): Promise<OrganizationDocument> {
    const organization = await this.organizationModel.findOne({ slug }).exec();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findById(id: string): Promise<OrganizationDocument> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
    userId: string,
  ): Promise<OrganizationDocument> {
    const organization = await this.findById(id);

    // Check if user is the creator
    if (organization.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this organization',
      );
    }

    Object.assign(organization, updateOrganizationDto);
    return organization.save();
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const organization = await this.findById(id);

    // Check if user is the creator
    if (organization.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this organization',
      );
    }

    await this.organizationModel.findByIdAndDelete(id).exec();
    return { message: 'Organization deleted successfully' };
  }

  async addMember(
    id: string,
    memberId: string,
    userId: string,
  ): Promise<OrganizationDocument> {
    const organization = await this.findById(id);

    // Check if user is the creator
    if (organization.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to add members to this organization',
      );
    }

    // Check if member is already in organization
    if (organization.members.includes(memberId)) {
      return organization;
    }

    organization.members.push(memberId);
    const savedOrg = await organization.save();

    // Add user to organization in their profile
    await this.usersService.addToOrganization(memberId, id);

    return savedOrg;
  }

  async removeMember(
    id: string,
    memberId: string,
    userId: string,
  ): Promise<OrganizationDocument> {
    const organization = await this.findById(id);

    // Check if user is the creator or the member themself
    if (organization.creatorId !== userId && memberId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to remove members from this organization',
      );
    }

    // Cannot remove the creator
    if (memberId === organization.creatorId) {
      throw new ForbiddenException(
        'Cannot remove the creator from the organization',
      );
    }

    // Check if member is in organization
    const memberIndex = organization.members.indexOf(memberId);
    if (memberIndex === -1) {
      return organization;
    }

    organization.members.splice(memberIndex, 1);
    return organization.save();
  }
}
