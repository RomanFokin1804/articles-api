import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from '../../roles/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    type: String,
    description: 'User email',
    example: 'test@gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsEnum(RolesEnum, { each: true })
  @ApiProperty({
    required: false,
    description: 'Name of roles',
    example: ['Editor'],
    enum: [RolesEnum],
  })
  roles?: RolesEnum[];
}
