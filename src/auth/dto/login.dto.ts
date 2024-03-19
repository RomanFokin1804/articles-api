import { IsEnum, IsOptional } from 'class-validator';
import { RolesEnum } from '../../roles/enums/roles.enum';
import { BaseUsersDto } from '../../users/dto/base-users.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto extends BaseUsersDto {
  @IsOptional()
  @IsEnum(RolesEnum)
  @ApiProperty({
    required: false,
    description: 'Role name',
    example: 'Editor',
    enum: RolesEnum,
  })
  role?: RolesEnum;
}
