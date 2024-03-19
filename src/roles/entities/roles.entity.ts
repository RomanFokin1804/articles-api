import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToMany,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { RolesEnum } from '../enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export abstract class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    required: true,
    type: 'uuid',
    description: 'Id of role',
    example: 'df766520-83ac-4f5a-ae1e-00c120763a28',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    required: true,
    uniqueItems: true,
    description: 'Name of role',
    example: 'Editor',
    enum: RolesEnum,
  })
  name: RolesEnum;

  @ManyToMany(() => UsersEntity, (user) => user.roles, { cascade: true })
  users: UsersEntity[];

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
