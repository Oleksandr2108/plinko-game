import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type {
  AuthErrorResponse,
  TokensResponse,
} from "@/entities/auth/model/types";
import { API_BASE_URL } from "@/shared/config";
import { deleteCookie, getCookie, setCookie } from "@/shared/lib";

export const apiClient = axios.create({
  baseURL: typeof window === "undefined" ? API_BASE_URL : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshTokensPromise: Promise<string | null> | null = null;

const persistTokens = (accessToken: string, refreshToken: string) => {
  setCookie("accessToken", accessToken);
  setCookie("refreshToken", refreshToken);
};

const clearTokens = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};

const refreshAccessToken = async () => {
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    return null;
  }

  const { data } = await axios.post<TokensResponse>(
    "/api/auth/refresh",
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  persistTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
};

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getCookie("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<AuthErrorResponse>) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    if (
      !originalRequest ||
      originalRequest._retry ||
      status !== 401 ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshTokensPromise) {
        refreshTokensPromise = refreshAccessToken().finally(() => {
          refreshTokensPromise = null;
        });
      }

      const accessToken = await refreshTokensPromise;

      if (!accessToken) {
        clearTokens();
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      return Promise.reject(refreshError);
    }
  },
);
