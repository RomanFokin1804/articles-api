import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';
import { RolesDto } from './dto/roles.dto';
import { UsersService } from '../users/users.service';
import { RolesEnum } from './enums/roles.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getById(id: string): Promise<RolesEntity> {
    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role with this id not exist!');
    }

    return role;
  }

  async getByName(name: RolesEnum): Promise<RolesEntity> {
    const role = await this.rolesRepository.findOneBy({ name });

    if (!role) {
      throw new NotFoundException('Role with this name not exist!');
    }

    return role;
  }

  async getByUser(userId: string): Promise<RolesEntity[]> {
    const user = await this.usersService.getById(userId, { roles: true });
    return user.roles;
  }

  async getAll(): Promise<RolesEntity[]> {
    return this.rolesRepository.find();
  }

  async create(data: RolesDto): Promise<RolesEntity> {
    return await this.rolesRepository.save(data);
  }

  async update(id: string, data: RolesDto): Promise<any> {
    await this.rolesRepository.update({ id }, data);

    return await this.getById(id);
  }

  async delete(id: string): Promise<void> {
    await this.rolesRepository.delete({ id });
    return;
  }
}
