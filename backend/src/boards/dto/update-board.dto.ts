import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: any;

  @IsOptional()
  collaborators?: string[];
}
