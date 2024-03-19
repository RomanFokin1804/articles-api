import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('articles')
export abstract class ArticlesEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    required: true,
    type: 'uuid',
    description: 'Id of article',
    example: 'df766520-83ac-4f5a-ae1e-00c120763a28',
  })
  id: string;

  @Column()
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Title of article',
    example: 'Unleashing the Power of AI: Transforming the Future of Business',
  })
  title: string;

  @Column({ type: 'text' })
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Text of article',
    example:
      'AI will change how businesses work. As of now, that assertion won’t shock you. The effect of artificial intelligence on the working environment is now occurring.',
  })
  body: string;

  @ManyToOne(() => UsersEntity, (user) => user.articles)
  user: UsersEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    required: true,
    type: 'datetime',
    description: 'Date of record creating',
    example: '2024-03-18T23:04:30.539Z',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({
    required: true,
    type: 'datetime',
    description: 'Date of last record updating',
    example: '2024-03-18T23:04:30.539Z',
  })
  updatedAt: Date;
}
