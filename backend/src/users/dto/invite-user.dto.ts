import { IsEmail, IsString, IsOptional } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  boardId: string;

  @IsString()
  @IsOptional()
  message?: string;
}
