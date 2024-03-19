import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArticlesEntity } from '../entities/articles.entity';

export class PaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Current page',
    example: '1',
  })
  page: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Count of articles per page',
    example: '10',
  })
  limit: number;
}

class PaginationResMeta {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Count of total items',
    example: 5,
  })
  totalItems?: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Count of items on current page',
    example: 1,
  })
  itemCount: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Count of items per page',
    example: 2,
  })
  itemsPerPage: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Count of total pages',
    example: 3,
  })
  totalPages?: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'Number of current page',
    example: 3,
  })
  currentPage: number;
}

export class PaginationResDto {
  @ApiProperty({
    required: true,
    type: [ArticlesEntity],
    description: 'List of articles',
  })
  items: ArticlesEntity[];

  @ApiProperty({
    required: true,
    type: PaginationResMeta,
    description: 'Pagination metadata',
  })
  meta: PaginationResMeta;
}
