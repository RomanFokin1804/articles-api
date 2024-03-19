import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CONFIG_JWT_REFRESH } from '../../config/config.constant';
import { ConfigService } from '@nestjs/config';
import { IJWTConfig } from '../../config/config.jwt-access';
import { UsersService } from '../../users/users.service';
import { IJwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['refresh_token'];
      }

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<IJWTConfig>(CONFIG_JWT_REFRESH).secret,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    const user = await this.userService.getById(payload.id);
    if (!user) throw new UnauthorizedException('User not exist!');

    return { id: payload.id, role: payload.role };
  }
}
