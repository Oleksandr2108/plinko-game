import { apiClient } from "@/shared/api";
import { useUserStore } from "@/entities/user";
import { deleteCookie } from "@/shared/lib";

export async function logout() {
  await apiClient.post("/auth/logout").catch(() => {});
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  useUserStore.getState().setUser(null);
}
