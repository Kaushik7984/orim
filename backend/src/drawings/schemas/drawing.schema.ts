import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';

export class Point {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}

export class DrawingElement {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Point)
  @IsOptional()
  points?: Point[];

  @IsString()
  @IsOptional()
  strokeColor?: string;

  @IsString()
  @IsOptional()
  fillColor?: string;

  @IsNumber()
  @IsOptional()
  strokeWidth?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsNumber()
  @IsOptional()
  fontSize?: number;

  @IsString()
  @IsOptional()
  fontFamily?: string;
}

export class DrawingViewport {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsNumber()
  width!: number;

  @IsNumber()
  height!: number;

  @IsNumber()
  zoom!: number;
}

export class DrawingContent {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrawingElement)
  elements!: DrawingElement[];

  @IsObject()
  @ValidateNested()
  @Type(() => DrawingViewport)
  viewport!: DrawingViewport;
}

export type DrawingDocument = Drawing & Document;

@Schema({ timestamps: true })
export class Drawing {
  @Prop({ required: true })
  name!: string;

  @Prop({
    type: {
      elements: [
        {
          id: String,
          type: String,
          x: Number,
          y: Number,
          width: Number,
          height: Number,
          points: [{ x: Number, y: Number }],
          strokeColor: String,
          fillColor: String,
          strokeWidth: Number,
          text: String,
          fontSize: Number,
          fontFamily: String,
        },
      ],
      viewport: {
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        zoom: Number,
      },
    },
    required: true,
    default: {
      elements: [],
      viewport: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        zoom: 1,
      },
    },
  })
  content!: DrawingContent;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  collaborators!: Types.ObjectId[];

  @Prop({ default: false })
  isPublic!: boolean;

  @Prop({ type: String, default: '#FFFFFF' })
  backgroundColor!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
    validate: {
      validator: function (value: unknown) {
        return typeof value === 'object' && value !== null;
      },
      message: 'Settings must be an object',
    },
  })
  settings!: Record<string, unknown>;

  @Prop({ type: Date })
  lastAccessedAt!: Date;

  @Prop({ type: Number, default: 0 })
  version!: number;
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing);
