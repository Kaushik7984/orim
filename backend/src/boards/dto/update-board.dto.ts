import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  canvasData: any;

  @IsOptional()
  content?: any;

  @IsOptional()
  collaborators?: string[];
}
