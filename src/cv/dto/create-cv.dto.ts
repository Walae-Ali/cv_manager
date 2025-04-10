import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsInt()
  age: number;

  @IsString()
  cin: string;

  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  skills?: number[]; // IDs of related skills

  @IsOptional()
  userId?: number;
}
