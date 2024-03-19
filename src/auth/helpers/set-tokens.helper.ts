import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ITokens } from '../interfaces/jwt.interface';

export async function setTokensHelper(res: Response, tokens: ITokens) {
  res.cookie('access_token', tokens.accessToken, {
    maxAge: 2592000000,
    sameSite: true,
    secure: false,
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    maxAge: 2592000000,
    sameSite: true,
    secure: false,
  });

  return res.status(HttpStatus.OK).json();
}
