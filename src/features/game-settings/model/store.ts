import { create } from "zustand";

interface GameSettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
  setAnimationsEnabled: (animationsEnabled: boolean) => void;
}

export const useGameSettingsStore = create<GameSettingsState>((set) => ({
  soundEnabled: true,
  animationsEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
}));
