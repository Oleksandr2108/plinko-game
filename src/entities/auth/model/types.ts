export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse extends LoginResponse {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthErrorResponse {
  statusCode: number;
  message: string[] | string;
  error: string;
  path: string;
}
