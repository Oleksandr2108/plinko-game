"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageToolbar } from "@/shared/ui";
import { AppFooter } from "@/widgets/footer";

const PAGE_TITLES: Record<string, string> = {
  "/progress": "Progression",
  "/history": "History",
  "/profile": "Profile",
};

export function SectionChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "";

  return (
    <div className="flex min-h-dvh flex-col">
      <PageToolbar title={title} />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      <AppFooter activeHref={pathname} />
    </div>
  );
}
