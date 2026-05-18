import { apiClient } from "@/shared/api";
import { useUserStore } from "@/entities/user";

export async function logout() {
  await apiClient.post("/auth/logout").catch(() => {});
  localStorage.removeItem("token");
  useUserStore.getState().setUser(null);
}
