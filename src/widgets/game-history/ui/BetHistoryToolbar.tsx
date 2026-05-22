import Image from "next/image";
import Link from "next/link";

import BackArrowIcon from "../../../../public/icons/backArrowsItem.svg";

export function BetHistoryToolbar() {
  return (
    <div className="flex items-center gap-4 border-b border-(--borderColor) px-6 py-2.5">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-[10px] border border-(--borderColor) bg-(--bgSecondaryTab) px-4 py-2 text-[16px] font-medium text-(--secondaryText) transition-colors hover:bg-(--bgTabActive)"
      >
        <Image
          src={BackArrowIcon}
          alt="Back Arrow Icon"
        />
        Back to Game
      </Link>
      <h1 className="text-[24px] font-bold text-white">Bet History</h1>
    </div>
  );
}
