import Image from "next/image";
import Link from "next/link";
import BackArrowIcon from "../../../../public/icons/backArrowsItem.svg";

export function PageToolbar({ title }: { title: string }) {
  return (
    <div className="flex h-14 items-center border-b border-(--borderColor) bg-[var(--bgSurfaceToolbar)] px-4">
      <div className="mx-auto flex h-full w-full max-w-4xl items-center gap-4">
        <Link
          href="/"
          aria-label="Back to game"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-(--secondaryText) transition-colors hover:bg-(--bgTabActive)"
        >
          <Image
            src={BackArrowIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
          />
        </Link>
        <h1 className="truncate text-[18px] font-bold leading-7 text-(--colorWhite)">
          {title}
        </h1>
      </div>
    </div>
  );
}
