"use client";

import Link from "next/link";

type FooterItem = {
  href: string;
  label: string;
  icon: string;
};

type AppFooterProps = {
  activeHref?: string;
  className?: string;
  items?: FooterItem[];
};

const DEFAULT_ITEMS: FooterItem[] = [
  {
    href: "/",
    label: "Game",
    icon: "/icons/homeIcon.svg",
  },
  {
    href: "/progress",
    label: "Progress",
    icon: "/icons/progressIcon.svg",
  },
  {
    href: "/history",
    label: "History",
    icon: "/icons/historyIcon.svg",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "/icons/profileIcon.svg",
  },
];

export function AppFooter({
  activeHref = "/",
  className,
  items = DEFAULT_ITEMS,
}: AppFooterProps) {
  return (
    <footer
      className={[
        "w-full border-t border-(--borderColor) bg-(--bgSurface) px-1 pb-[max(env(safe-area-inset-bottom),8px)] sm:px-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <nav
        aria-label="Bottom navigation"
        className="mx-auto grid max-w-4xl grid-cols-4 justify-items-center"
      >
        {items.map((item) => {
          const isActive = activeHref === item.href;

          return (
            <div
              key={item.href}
              className="relative w-full max-w-18"
            >
              {isActive && (
                <div className="mx-auto h-1 w-12 rounded-bl-3xl rounded-br-3xl bg-(--colorAccess)" />
              )}

              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 pb-1.5 transition-colors sm:px-2 ${
                  isActive ? "text-(--colorAccess)" : "text-(--text)"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5"
                  style={{
                    backgroundColor: isActive
                      ? "var(--colorAccess)"
                      : "currentColor",
                    maskImage: `url(${item.icon})`,
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskImage: `url(${item.icon})`,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                  }}
                />
                <span className="text-[12px] font-medium leading-none sm:text-[16px]">
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>
    </footer>
  );
}
