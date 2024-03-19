import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetByUserIdDto {
  @IsUUID()
  @ApiProperty({
    required: true,
    type: 'uuid',
    description: 'Id of user',
    example: 'df766520-83ac-4f5a-ae1e-00c120763a28',
  })
  userId: string;
}
