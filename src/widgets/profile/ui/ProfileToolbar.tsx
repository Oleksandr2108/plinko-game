import Image from "next/image";
import Link from "next/link";
import BackArrowIcon from "../../../../public/icons/backArrowsItem.svg";

export function ProfileToolbar() {
  return (
    <div className="flex h-14 items-center gap-4 border-b border-(--borderColor) bg-[#1a1f2e] px-6">
      <Link
        href="/"
        aria-label="Back to game"
        className="flex h-9 w-9 items-center justify-center rounded-[10px] text-(--secondaryText) transition-colors hover:bg-(--bgTabActive)"
      >
        <Image
          src={BackArrowIcon}
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
        />
      </Link>
      <h1 className="text-[16px] font-bold text-white">Profile</h1>
    </div>
  );
}
