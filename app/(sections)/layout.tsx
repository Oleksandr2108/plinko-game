import type { ReactNode } from "react";
import { SectionChrome } from "./SectionChrome";

export default function SectionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SectionChrome>{children}</SectionChrome>;
}
