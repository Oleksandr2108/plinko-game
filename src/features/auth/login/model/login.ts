import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useUserStore } from "@/entities/user";
import type {
  AuthCredentials,
  AuthErrorResponse,
  LoginResponse,
} from "@/entities/auth/model/types";
import { authApi } from "@/features/auth/api/authApi";
import { setCookie } from "@/shared/lib";

export type LoginDto = AuthCredentials;

const persistTokens = (accessToken: string, refreshToken: string) => {
  setCookie("accessToken", accessToken);
  setCookie("refreshToken", refreshToken);
};

const extractMessages = (error: unknown) => {
  if (isAxiosError<AuthErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message;
    }

    if (typeof message === "string") {
      return [message];
    }
  }

  return ["Unable to sign in. Please try again."];
};

export async function login(dto: LoginDto) {
  const data = await authApi.login(dto);
  persistTokens(data.accessToken, data.refreshToken);
  useUserStore.getState().setUser(null);
  return data;
}

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (messages: string[]) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation<LoginResponse, unknown, LoginDto>({
    mutationFn: login,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(extractMessages(error));
    },
  });
}
