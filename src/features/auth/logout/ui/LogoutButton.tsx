"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoutIcon from "../../../../../public/icons/logout.svg";
import { logout } from "../model/logout";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={[
        "flex items-center gap-2 rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] px-4 py-3 text-[16px] font-medium text-(--secondaryText) transition-colors hover:bg-(--bgTabActive) cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={LogoutIcon}
        alt="Logout Icon"
      />
      Logout
    </button>
  );
}
