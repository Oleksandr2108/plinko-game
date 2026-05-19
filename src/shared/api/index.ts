import axios from "axios";
import { API_BASE_URL } from "@/shared/config";
import { getCookie } from "@/shared/lib";

export const apiClient = axios.create({
  baseURL: typeof window === "undefined" ? API_BASE_URL : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? getCookie("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
