export interface IJwtPayload {
  id: string;
  role: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
