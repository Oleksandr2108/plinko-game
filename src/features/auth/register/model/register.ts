import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useUserStore } from "@/entities/user";
import type {
  AuthCredentials,
  AuthErrorResponse,
  RegisterResponse,
} from "@/entities/auth/model/types";
import { authApi } from "@/features/auth/api/authApi";
import { setCookie } from "@/shared/lib";

export type RegisterDto = AuthCredentials;

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

  return ["Unable to create account. Please try again."];
};

export async function register(dto: RegisterDto) {
  const data = await authApi.register(dto);
  persistTokens(data.accessToken, data.refreshToken);
  useUserStore.getState().setUser({ ...data.user, balance: 0 });
  return data;
}

interface UseRegisterOptions {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (messages: string[]) => void;
}

export function useRegister(options: UseRegisterOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation<RegisterResponse, unknown, RegisterDto>({
    mutationFn: register,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(extractMessages(error));
    },
  });
}
