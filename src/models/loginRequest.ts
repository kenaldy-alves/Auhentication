export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshTokenRequest = {
  /** The refresh token. */
  refreshToken: string;
};

export type AuthResponse = {
  /** The access token. */
  accessToken: string;
  /** The expiration period of the authentication result in seconds. */
  expiresIn: number;
  /** The refresh token. */
  refreshToken: string;
  /** The IdToken. */
  idToken: string;
};

export type UserDataResponse = {
  /** The access token. */
  accessToken: string;
  /** The refresh token. */
  refreshToken: string;
  /** The Id token. */
  idToken: string;
  /** The expiration period of the authentication result in seconds. */
  expiresIn: number;
  /** Id user. */
  id: string;
  /** User name. */
  name: string;
};
