import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../roles/enums/roles.enum';

export interface Error {
  message: string | [string];
  error: string;
  statusCode: number;
}

export interface UnauthorizedErr {
  message: string;
  statusCode: number;
}

export class BadRequestErrorDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error message',
    example: 'Incorrect data!',
  })
  message: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error description',
    example: "Bad Request or ['title must be not empty']",
  })
  error: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Status code of error',
    example: 400,
  })
  statusCode: number;
}

export class BadRequestLoginErrorDto extends BadRequestErrorDto {
  @ApiProperty({
    required: true,
    description: 'List of available roles',
    example: ['Viewer', 'Editor'],
    enum: [RolesEnum],
  })
  roles?: RolesEnum[];
}

export class UnauthorizedErrorDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Status code of error',
    example: 401,
  })
  statusCode: number;
}

export class ForbiddenErrorDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error message',
    example: 'Forbidden resource',
  })
  message: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error description',
    example: 'Forbidden',
  })
  error: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Status code of error',
    example: 403,
  })
  statusCode: number;
}

export class NotFoundErrorDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error message',
    example: 'Item with this id not exist!',
  })
  message: string;

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Error description',
    example: 'Not Found',
  })
  error: string;

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Status code of error',
    example: 404,
  })
  statusCode: number;
}
