'use client'
import Image from "next/image";
import BetIcon from "../../../../public/icons/betIcon.svg";
import { useUserStore } from "@/entities/user/model/store";
import Link from "next/link";
import HistoryIcon from "../../../../public/icons/historyIcon.svg";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function Header() {
  const balance = useUserStore((state) => state.user?.balance ?? 0);
  return (
    <header className="w-full border-b border-(--borderColor) px-6 flex items-center justify-between h-16">
      <div className="flex items-center gap-5">
        <h1 className="text-[24px] font-bold text-white">Plinko</h1>
        <div className="flex items-center rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] px-4 py-2 gap-2">
          <Image
            src={BetIcon}
            alt="Bet Icon"
          />
          
          <span className="text-[12px] font-normal text-(--text)">
            Balance:
          </span>
          <span className="text-[18px] font-bold text-(--colorAccess)">
            {formatter.format(balance)}
          </span>
        </div>
      </div>
      <Link href="/history" className="flex items-center gap-2 rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] px-4 py-3 text-[16px] font-medium text-(--secondaryText) transition-colors hover:bg-(--bgTabActive)">
        <Image
          src={HistoryIcon}
          alt="History Icon"
        />
        History
      </Link>
    </header>
  );
}
