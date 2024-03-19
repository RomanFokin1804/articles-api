import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { IJwtPayload, ITokens } from './interfaces/jwt.interface';
import { RolesService } from '../roles/roles.service';
import { RolesEnum } from '../roles/enums/roles.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async register(data: RegisterDto): Promise<void> {
    const existingUser = await this.usersService.getByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User already exist!');
    }

    await this.usersService.create({
      email: data.email,
      password: await argon2.hash(data.password),
      roles: [RolesEnum.Viewer],
    });

    return;
  }

  async login(data: LoginDto): Promise<ITokens> {
    const existingUser = await this.usersService.getByEmail(data.email);
    if (!existingUser) {
      throw new UnauthorizedException('Email or password is wrong!');
    }

    let passwordMatches;
    if (
      // Fast bad solution :(
      data.email === 'admin@test.com' &&
      data.password === existingUser.password
    ) {
      passwordMatches = true;
    } else {
      passwordMatches = await argon2.verify(
        existingUser.password,
        data.password,
      );
    }

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is wrong!');
    }

    const roles = await this.rolesService.getByUser(existingUser.id);

    if (data.role) {
      if (!roles.some((role) => role.name === data.role)) {
        throw new ForbiddenException(
          'This user does not have permission for this role!',
        );
      }

      return await this.getTokens({
        id: existingUser.id,
        role: data.role,
      });
    } else {
      if (roles.length === 1) {
        return await this.getTokens({
          id: existingUser.id,
          role: roles[0].name,
        });
      } else {
        throw new BadRequestException({
          message: 'Please, select a role from the list',
          roles: roles.map((role) => role.name),
        });
      }
    }
  }

  async refreshTokens(data: IJwtPayload): Promise<ITokens> {
    const user = await this.usersService.getById(data.id);
    if (!user) {
      throw new BadRequestException('User not exist!');
    }

    return await this.getTokens(data);
  }

  async addRoleToUser(data: AddRoleToUserDto): Promise<void> {
    const role = await this.rolesService.getByName(data.role);
    if (!role) {
      throw new NotFoundException('Role not exist!');
    }

    const user = await this.usersService.getById(data.userId, { roles: true });
    if (!user) {
      throw new NotFoundException('User not exist!');
    }

    const existingRoles = user.roles.map((role) => role.name);

    await this.usersService.update(data.userId, {
      roles: [...existingRoles, data.role],
    });

    return;
  }

  async changeRole(
    data: ChangeRoleDto,
    payload: IJwtPayload,
  ): Promise<ITokens> {
    const user = await this.usersService.getById(payload.id);
    if (!user) {
      throw new NotFoundException('User not exist!');
    }

    const roles = await this.rolesService.getByUser(payload.id);

    if (!roles.some((role) => role.name === data.role)) {
      throw new ForbiddenException(
        'This user does not have permission for this role!',
      );
    }

    return await this.getTokens({
      id: user.id,
      role: data.role,
    });
  }

  async getTokens(payload: IJwtPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
