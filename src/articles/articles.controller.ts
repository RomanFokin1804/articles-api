import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { ArticlesService } from './articles.service';
import { ArticlesDto, ArticlesUpdateDto } from './dto/articles.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../roles/enums/roles.enum';
import { RoleGuard } from '../auth/guards/role.guard';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
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
import { ArticlesEntity } from './entities/articles.entity';
import {
  BadRequestErrorDto,
  UnauthorizedErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
} from '../swagger/errors.dto';
import { IdDto } from './dto/id.dto';
import { GetByUserIdDto } from './dto/get-by-user-id.dto';
import { PaginationDto, PaginationResDto } from './dto/pagination.dto';

@Controller('article')
@UseGuards(JwtAccessAuthGuard, RoleGuard)
@ApiTags('articles')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'User not authorized',
  type: UnauthorizedErrorDto,
})
@ApiForbiddenResponse({
  description: 'User does not have permission to access to this resource',
  type: ForbiddenErrorDto,
})
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post()
  @Roles(RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary: 'Create article. Available to roles: Editor, Admin',
  })
  @ApiCreatedResponse({
    description: 'Article created',
    type: ArticlesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error or creator of article not exist',
    type: BadRequestErrorDto,
  })
  async create(@Body() data: ArticlesDto, @Req() req: Request) {
    return this.articlesService.create(data, req.user as IJwtPayload);
  }

  @Get('/:id')
  @Roles(RolesEnum.Viewer, RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary: 'Get article by id. Available to roles: Viewer, Editor, Admin',
  })
  @ApiOkResponse({
    description: 'Article submitted',
    type: ArticlesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Article with this id not found',
    type: NotFoundErrorDto,
  })
  async getById(@Param() params: IdDto) {
    return await this.articlesService.getById(params.id);
  }

  @Get('/user/:userId')
  @Roles(RolesEnum.Viewer, RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary:
      'Get articles by user id. Available to roles: Viewer, Editor, Admin',
  })
  @ApiOkResponse({
    description: 'Articles submitted',
    type: [ArticlesEntity],
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'User with this id not found',
    type: NotFoundErrorDto,
  })
  async getByUser(@Param() params: GetByUserIdDto) {
    return await this.articlesService.getByUser(params.userId);
  }

  @Get()
  @Roles(RolesEnum.Viewer, RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary:
      'Get all articles with pagination. Available to roles: Viewer, Editor, Admin',
  })
  @ApiOkResponse({
    description: 'Articles submitted',
    type: PaginationResDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async getAll(@Query() query: PaginationDto) {
    return await this.articlesService.getAll(query.page, query.limit);
  }

  @Patch('/:id')
  @Roles(RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary:
      'Update article by id. Available to roles: Editor, Admin. Editors can update only their articles',
  })
  @ApiOkResponse({
    description: 'Article updated',
    type: ArticlesEntity,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async update(
    @Param() params: IdDto,
    @Body() body: ArticlesUpdateDto,
    @Req() req: Request,
  ) {
    return await this.articlesService.update(
      params.id,
      body,
      req.user as IJwtPayload,
    );
  }

  @Delete('/:id')
  @Roles(RolesEnum.Editor, RolesEnum.Admin)
  @ApiOperation({
    summary:
      'Delete article by id. Available to roles: Editor, Admin. Editors can delete only their articles',
  })
  @ApiOkResponse({
    description: 'Article deleted',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  async delete(@Param() params: IdDto, @Req() req: Request) {
    return await this.articlesService.delete(
      params.id,
      req.user as IJwtPayload,
    );
  }
}
