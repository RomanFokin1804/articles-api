import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { RolesService } from './roles.service';
import { RolesDto } from './dto/roles.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleGuard } from '../auth/guards/role.guard';
import { RolesEnum } from './enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { IdDto } from './dto/id.dto';
import {
  BadRequestErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
  UnauthorizedErrorDto,
} from '../swagger/errors.dto';
import { RolesEntity } from './entities/roles.entity';

@Controller('role')
@UseGuards(JwtAccessAuthGuard, RoleGuard)
@ApiTags('roles')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'User not authorized',
  type: UnauthorizedErrorDto,
})
@ApiForbiddenResponse({
  description: 'User does not have permission to access to this resource',
  type: ForbiddenErrorDto,
})
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Create role. Available to roles: Admin',
  })
  @ApiCreatedResponse({
    description: 'Role created',
    type: RolesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async create(@Body() data: RolesDto) {
    return this.rolesService.create(data);
  }

  @Get('/:id')
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Get role by id. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'Role submitted',
    type: RolesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Role with this id not found',
    type: NotFoundErrorDto,
  })
  async getById(@Param() params: IdDto) {
    return await this.rolesService.getById(params.id);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Get all roles. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'Roles submitted',
    type: [RolesEntity],
  })
  async getAll() {
    return await this.rolesService.getAll();
  }

  @Patch('/:id')
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Update role by id. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'Role updated',
    type: RolesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async update(@Param() params: IdDto, @Body() body: RolesDto) {
    return await this.rolesService.update(params.id, body);
  }

  @Delete('/:id')
  @Roles(RolesEnum.Admin)
  @ApiOperation({
    summary: 'Delete role by id. Available to roles: Admin',
  })
  @ApiOkResponse({
    description: 'Role deleted',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async delete(@Param() params: IdDto) {
    return await this.rolesService.delete(params.id);
  }
}
