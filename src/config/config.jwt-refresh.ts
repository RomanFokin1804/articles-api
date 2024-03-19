import { registerAs } from '@nestjs/config';
import { CONFIG_JWT_REFRESH } from './config.constant';
import * as process from 'process';

export interface IJWTConfig {
  readonly secret: string;
  readonly signOptions: {
    expiresIn: string;
  };
}

export default registerAs(
  CONFIG_JWT_REFRESH,
  (): IJWTConfig => ({
    secret: process.env.JWT_REFRESH_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  }),
);
