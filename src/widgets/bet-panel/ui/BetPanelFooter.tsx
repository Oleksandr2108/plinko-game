"use client";

import Image from "next/image";

import IconFullScreen from "../../../../public/icons/fullScreenIcon.svg";
import IconSettings from "../../../../public/icons/settingIcon.svg";

export function BetPanelFooter() {
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
      <Image
        src={IconSettings}
        alt="Settings"
      />
    </div>
  );
}
