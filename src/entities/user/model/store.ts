import { create } from "zustand";
import type { User } from "./types";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: () => get().user !== null,
}));
