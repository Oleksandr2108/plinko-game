"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BetIcon from "../../../../public/icons/betIcon.svg";
import LogoutIcon from "../../../../public/icons/logout.svg";
import { LogoutButton } from "@/features/auth/logout";
import { logout } from "@/features/auth/logout/model/logout";
import { useUserStore } from "@/entities/user/model/store";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function Header() {
  const router = useRouter();
  const balance = useUserStore((state) => state.user?.balance ?? 0);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="flex h-16 w-full items-center justify-between gap-3 border-b border-(--borderColor) px-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-(--secondaryText) md:hidden"
        >
          <span className="relative h-4 w-5 before:absolute before:left-0 before:top-0 before:h-0.5 before:w-5 before:bg-current after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-5 after:bg-current">
            <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current" />
          </span>
        </button>
        <h1 className="shrink-0 text-[20px] font-bold text-white sm:text-[24px]">
          Plinko
        </h1>
        <div className="flex min-w-0 items-center gap-1.5 rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] px-2.5 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
          <Image
            src={BetIcon}
            alt="Bet Icon"
            className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
          />

          <span className="hidden text-[12px] font-normal text-(--text) sm:inline">
            Balance:
          </span>
          <span className="min-w-0 truncate text-[15px] font-bold text-(--colorAccess) sm:text-[18px]">
            {formatter.format(balance)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Logout"
        className="flex h-[30px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] md:hidden"
      >
        <Image
          src={LogoutIcon}
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
        />
      </button>
      <div className="hidden items-center gap-3 md:flex">
        <LogoutButton />
      </div>
    </header>
  );
}
