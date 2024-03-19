import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { IJwtPayload } from './interfaces/jwt.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesEnum } from '../roles/enums/roles.enum';
import { setTokensHelper } from './helpers/set-tokens.helper';
import { RoleGuard } from './guards/role.guard';
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
import {
  BadRequestErrorDto,
  BadRequestLoginErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
  UnauthorizedErrorDto,
} from '../swagger/errors.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registration',
  })
  @ApiCreatedResponse({
    description: 'Registration success',
  })
  @ApiBadRequestResponse({
    description: 'Validation error or user with this email already exist',
    type: BadRequestErrorDto,
  })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkResponse({
    description: 'Login success, cookies access_token and refresh_token is set',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error or user have many roles, need to choose one of then',
    type: BadRequestLoginErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized',
    type: UnauthorizedErrorDto,
  })
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(data);

    return setTokensHelper(res, tokens);
  }

  @Post('add-role-to-user')
  @Roles(RolesEnum.Admin)
  @UseGuards(JwtAccessAuthGuard, RoleGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Add role to user. Available to roles: Admin',
  })
  @ApiCreatedResponse({
    description: 'Role added',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Role or user with this ids not found',
    type: NotFoundErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized',
    type: UnauthorizedErrorDto,
  })
  async addRoleToUser(@Body() data: AddRoleToUserDto) {
    return await this.authService.addRoleToUser(data);
  }

  @Post('change-role')
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change role by user',
  })
  @ApiOkResponse({
    description: 'Role changed, cookies access_token and refresh_token is set',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Role or user with this ids not found',
    type: NotFoundErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized',
    type: UnauthorizedErrorDto,
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access to this resource',
    type: ForbiddenErrorDto,
  })
  async changeRole(
    @Body() data: ChangeRoleDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.changeRole(
      data,
      req.user as IJwtPayload,
    );

    return setTokensHelper(res, tokens);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Refresh tokens',
  })
  @ApiOkResponse({
    description:
      'Tokens refreshed, cookies access_token and refresh_token is set',
  })
  @ApiBadRequestResponse({
    description: 'User not exist',
    type: BadRequestErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authorized',
    type: UnauthorizedErrorDto,
  })
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const tokens = await this.authService.refreshTokens(user as IJwtPayload);

    return setTokensHelper(res, tokens);
  }
}
