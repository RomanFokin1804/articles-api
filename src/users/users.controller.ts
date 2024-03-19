import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../roles/enums/roles.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { IdDto } from './dto/id.dto';
import {
  BadRequestErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
  UnauthorizedErrorDto,
} from '../swagger/errors.dto';
import { RolesEntity } from '../roles/entities/roles.entity';
import { UsersEntity } from './entities/users.entity';

@Controller('user')
@UseGuards(JwtAccessAuthGuard, RoleGuard)
@ApiTags('users')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'User not authorized',
  type: UnauthorizedErrorDto,
})
@ApiForbiddenResponse({
  description: 'User does not have permission to access to this resource',
  type: ForbiddenErrorDto,
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Get user by id. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'User submitted',
    type: UsersEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'User with this id not found',
    type: NotFoundErrorDto,
  })
  async getById(@Param() params: IdDto) {
    return await this.usersService.getById(params.id);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Get all users. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'Users submitted',
    type: [UsersEntity],
  })
  async getAll() {
    return await this.usersService.getAll();
  }

  @Patch('/:id')
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Update user by id. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'User updated',
    type: UsersEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Role with this id not found',
    type: NotFoundErrorDto,
  })
  async update(@Param() params: IdDto, @Body() body: UpdateUserDto) {
    return await this.usersService.update(params.id, body);
  }

  @Delete('/:id')
  @Roles(RolesEnum.Editor, RolesEnum.Viewer, RolesEnum.Admin)
  @ApiOperation({
    summary:
      'Cascade delete user by id. Available to roles: Viewer, Editor, Admin. Viewers and Editors can delete only their users',
  })
  @ApiOkResponse({
    description: 'User deleted',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async delete(@Param() params: IdDto, @Req() req: Request) {
    return await this.usersService.delete(params.id, req.user as IJwtPayload);
  }
}
