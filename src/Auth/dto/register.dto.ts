import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from 'src/common/validators/unique.validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  }) // Swagger annotation
  @IsString()
  @IsNotEmpty()
  @Unique('username', { message: 'Username must be unique' })
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securePassword123',
  }) // Swagger annotation
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  }) // Swagger annotation
  @IsEmail()
  @IsNotEmpty()
  @Unique('email', { message: 'Email must be unique' })
  email: string;

}