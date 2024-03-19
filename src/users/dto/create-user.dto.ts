import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from '../../roles/enums/roles.enum';
import { BaseUsersDto } from './base-users.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends BaseUsersDto {
  @IsNotEmpty()
  @IsEnum(RolesEnum, { each: true })
  @ApiProperty({
    required: true,
    description: 'Name of roles',
    example: ['Editor'],
    enum: [RolesEnum],
  })
  roles: RolesEnum[];
}
