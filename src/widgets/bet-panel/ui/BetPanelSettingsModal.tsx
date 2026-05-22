"use client";

function SettingsToggle({
  checked,
  onChange,
  title,
  description,
  icon,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
  icon: "sound" | "animation";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="mt-1 text-(--colorAccess)">
          {icon === "sound" ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 9v6h4l5 4V5L9 9H5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 8.5a5 5 0 0 1 0 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 11a2 2 0 0 1 0 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13 2L4 14h6l-1 8 9-12h-6l1-8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          <p className="text-[14px] text-(--text)">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          "relative h-8 w-14 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-(--colorAccess) bg-(--colorAccess)"
            : "border-(--borderColor) bg-(--bgTab)",
        ].join(" ")}
        aria-pressed={checked}
      >
        <span
          className={[
            "absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function BetPanelSettingsModal({
  isOpen,
  onClose,
  soundEnabled,
  animationsEnabled,
  onSoundChange,
  onAnimationsChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  onSoundChange: (checked: boolean) => void;
  onAnimationsChange: (checked: boolean) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(5,8,14,0.72)] px-4 pt-10">
      <button
        type="button"
        className="absolute inset-0  cursor-default"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="relative z-10 m-auto w-full max-w-155 rounded-2xl border border-(--borderColor) bg-[rgba(26,31,46,0.98)] px-7 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-bold text-white">Settings</h2>
            <p className="mt-2 text-[16px] text-(--text)">
              Customize your gaming experience
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[28px] leading-none text-(--secondaryText) transition-colors hover:text-white cursor-pointer"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          <SettingsToggle
            checked={soundEnabled}
            onChange={onSoundChange}
            title="Sound Effects"
            description="Play sound effects during gameplay"
            icon="sound"
          />

          <SettingsToggle
            checked={animationsEnabled}
            onChange={onAnimationsChange}
            title="Animations"
            description="Enable smooth ball animations"
            icon="animation"
          />
        </div>

        <div className="mt-8 border-t border-(--borderColor) pt-6 text-[16px] text-(--text)">
          <p>
            <span className="text-(--secondaryText)">Version:</span> 1.0.0
          </p>
          <p className="mt-2">
            <span className="text-(--secondaryText)">Mode:</span> Demo (Mock
            API)
          </p>
        </div>
      </div>
    </div>
  );
}
