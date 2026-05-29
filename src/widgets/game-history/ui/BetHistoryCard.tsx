import Image from "next/image";
import type { Bet } from "@/entities/bet";
import type { ApiRiskLevel } from "@/entities/game";

import BetIcon from "../../../../public/icons/betIcon.svg";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const riskToneMap: Record<ApiRiskLevel, string> = {
  LOW: " bg-(--bgAccess) text-(--colorAccess)",
  MEDIUM: " bg-(--bgMedium) text-(--colorMedium)",
  HIGH: " bg-(--bgError) text-(--colorError)",
};

export function BetHistoryCard({ bet }: { bet: Bet }) {
  const profit = bet.payout - bet.amount;
  const profitTone =
    profit >= 0 ? "text-(--colorAccess)" : "text-(--colorError)";

  return (
    <article className="rounded-[10px] border border-(--borderColor) bg-[var(--bgSurfaceMuted)] px-3 py-3">
      <div className="grid grid-cols-2 gap-3 text-[12px] text-(--text) md:grid-cols-[1.6fr_1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_1fr] md:items-center">
        <div className="col-span-2 md:col-span-1">
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Time</p>
          <p className="text-[14px] text-(--secondaryText) md:whitespace-nowrap">
            {bet.createdAt
              ? dateFormatter.format(new Date(bet.createdAt))
              : "Unknown"}
          </p>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Settings</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] text-(--secondaryText)">
              {bet.rows} rows
            </span>
            <span
              className={[
                "rounded-md px-1.5 py-0.5 text-[12px] font-normal uppercase",
                riskToneMap[bet.risk],
              ].join(" ")}
            >
              {bet.risk}
            </span>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Multiplier</p>
          <p className="text-[20px] font-bold text-(--colorAccess)">
            {bet.multiplier.toFixed(1)}x
          </p>
        </div>

        <div>
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Bet Amount</p>
          <p className="truncate text-[14px] text-(--secondaryText)">
            {numberFormatter.format(bet.amount)}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Payout</p>
          <p className="truncate text-[14px] text-(--secondaryText)">
            {numberFormatter.format(bet.payout)}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[12px] text-(--colorSmallText)">Profit</p>
          <p className={`text-[14px] font-medium ${profitTone}`}>
            {profit >= 0 ? "+" : ""}
            {numberFormatter.format(profit)}
          </p>
        </div>

        <div className="col-span-2 border-t border-(--borderColor) pt-3 md:col-span-1 md:border-t-0 md:pt-0 md:text-right">
          <p className="mb-1 text-[12px] text-(--colorSmallText)">
            Balance After
          </p>
          <div className="inline-flex max-w-full items-center gap-1">
            <Image
              src={BetIcon}
              alt="Bet Icon"
              className="h-4 w-4 shrink-0"
            />
            <p className="truncate text-[14px] text-(--secondaryText)">
              {numberFormatter.format(bet.balanceAfter)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
