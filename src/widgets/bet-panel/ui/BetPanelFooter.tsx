"use client";

import { useState } from "react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { useGameSettingsStore } from "@/features/game-settings";

import IconFullScreen from "../../../../public/icons/fullScreenIcon.svg";
import IconSettings from "../../../../public/icons/settingIcon.svg";
import { BetPanelSettingsModal } from "./BetPanelSettingsModal";

export function BetPanelFooter() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [
    soundEnabled,
    animationsEnabled,
    setSoundEnabled,
    setAnimationsEnabled,
  ] = useGameSettingsStore(
    useShallow((state) => [
      state.soundEnabled,
      state.animationsEnabled,
      state.setSoundEnabled,
      state.setAnimationsEnabled,
    ]),
  );

  const toggleFullscreen = async () => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  return (
    <>
      <div className="-mx-4 flex h-16 w-[calc(100%+2rem)] items-center justify-between border-t border-(--borderColor) px-4 py-6">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="cursor-pointer"
          aria-label="Toggle fullscreen"
        >
          <Image
            src={IconFullScreen}
            alt="Full Screen"
          />
        </button>
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="cursor-pointer"
          aria-label="Open settings"
        >
          <Image
            src={IconSettings}
            alt="Settings"
          />
        </button>
      </div>

      <BetPanelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        animationsEnabled={animationsEnabled}
        onSoundChange={setSoundEnabled}
        onAnimationsChange={setAnimationsEnabled}
      />
    </>
  );
}
