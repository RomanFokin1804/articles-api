import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { RolesEnum } from '../roles/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,

    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
  ) {}

  async getById(
    id: string,
    relations?: FindOptionsRelations<UsersEntity>,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      throw new NotFoundException('User with this id not exist!');
    }

    return user;
  }

  async getByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  async getAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find({
      relations: { roles: true, articles: true },
    });
  }

  async create(data: CreateUserDto): Promise<UsersEntity> {
    const rolePromises = data.roles.map(
      async (name) => await this.rolesService.getByName(name),
    );

    const roles = await Promise.all(rolePromises);

    return await this.usersRepository.save({
      email: data.email,
      password: data.password,
      roles,
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UsersEntity> {
    const user = await this.getById(id);

    const rolePromises = data.roles.map(
      async (name) => await this.rolesService.getByName(name),
    );

    const roles = await Promise.all(rolePromises);

    await this.usersRepository.save({
      ...user,
      email: data.email || user.email,
      roles,
    });

    return await this.getById(id);
  }

  async delete(id: string, payload: IJwtPayload): Promise<void> {
    if (
      payload.role === RolesEnum.Editor ||
      payload.role === RolesEnum.Viewer
    ) {
      if (id !== payload.id) {
        throw new ForbiddenException('This is not your profile!');
      }
    }

    await this.usersRepository.delete({ id });
    return;
  }
}
