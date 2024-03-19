import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ArticlesEntity } from '../../articles/entities/articles.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    required: true,
    type: 'uuid',
    description: 'Id of user',
    example: 'df766520-83ac-4f5a-ae1e-00c120763a28',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    required: true,
    type: 'email',
    description: 'User email',
    example: 'test@gmail.com',
  })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => RolesEntity, (role) => role.users)
  @JoinTable()
  roles: RolesEntity[];

  @OneToMany(() => ArticlesEntity, (article) => article.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  articles: ArticlesEntity[];

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
