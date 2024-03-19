import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUsersDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    type: String,
    description: 'User email',
    example: 'test@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'User password',
    example: 'PsWd1924',
  })
  password: string;
}
