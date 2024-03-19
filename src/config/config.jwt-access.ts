import { registerAs } from '@nestjs/config';
import { CONFIG_JWT_ACCESS } from './config.constant';
import * as process from 'process';

export interface IJWTConfig {
  readonly secret: string;
  readonly signOptions: {
    expiresIn: string;
  };
}

export default registerAs(
  CONFIG_JWT_ACCESS,
  (): IJWTConfig => ({
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
  }),
);
