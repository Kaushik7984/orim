import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DrawingContent } from '../schemas/drawing.schema';

export class CreateDrawingDto {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DrawingContent)
  content?: DrawingContent;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}
