import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostsDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  text?: string;
}

export class DeletePostDto {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
