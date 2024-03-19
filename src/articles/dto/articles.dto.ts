import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticlesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Title of article',
    example: 'Unleashing the Power of AI: Transforming the Future of Business',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Text of article',
    example:
      'AI will change how businesses work. As of now, that assertion won’t shock you. The effect of artificial intelligence on the working environment is now occurring.',
  })
  body: string;
}

export class ArticlesUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Title of article',
    example: 'Unleashing the Power of AI: Transforming the Future of Business',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Text of article',
    example:
      'AI will change how businesses work. As of now, that assertion won’t shock you. The effect of artificial intelligence on the working environment is now occurring.',
  })
  body: string;
}
