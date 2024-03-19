import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RolesEnum } from '../enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RolesDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  @ApiProperty({
    required: true,
    description: 'Name of role',
    example: 'Editor',
    enum: RolesEnum,
  })
  name: RolesEnum;
}
