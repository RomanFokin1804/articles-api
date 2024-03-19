import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RolesEnum } from '../../roles/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddRoleToUserDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    required: true,
    type: String,
    description: 'User ID',
    example: 'df766520-83ac-4f5a-ae1e-00c120763a28',
  })
  userId: string;

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
