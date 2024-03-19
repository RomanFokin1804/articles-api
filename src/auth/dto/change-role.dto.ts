import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolesEnum } from '../../roles/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  @ApiProperty({
    required: true,
    description: 'Role name',
    example: 'Editor',
    enum: RolesEnum,
  })
  role: RolesEnum;
}
