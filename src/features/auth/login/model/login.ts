import { apiClient } from "@/shared/api";
import { useUserStore } from "@/entities/user";

interface LoginDto {
  email: string;
  password: string;
}

export async function login(dto: LoginDto) {
  const { data } = await apiClient.post<{
    token: string;
    user: import("@/entities/user").User;
  }>("/auth/login", dto);
  localStorage.setItem("token", data.token);
  useUserStore.getState().setUser(data.user);
  return data;
}
