import { apiClient } from "@/shared/api";
import type {
  AuthCredentials,
  LoginResponse,
  RegisterResponse,
} from "@/entities/auth/model/types";

export const authApi = {
  async login(credentials: AuthCredentials) {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  async register(credentials: AuthCredentials) {
    const { data } = await apiClient.post<RegisterResponse>(
      "/auth/register",
      credentials,
    );
    return data;
  },
};
