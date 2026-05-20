import { apiClient } from "@/shared/api";
import { useUserStore } from "@/entities/user";
import { deleteCookie, getCookie } from "@/shared/lib";

export async function logout() {
  const refreshToken = getCookie("refreshToken");

  await apiClient
    .post("/auth/logout", refreshToken ? { refreshToken } : undefined)
    .catch(() => {});
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  useUserStore.getState().setUser(null);
}
