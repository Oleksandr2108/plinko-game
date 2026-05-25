import { BetHistoryPage } from "@/widgets/game-history";
import { AppFooter } from "@/widgets/footer";

export default function History() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <BetHistoryPage />
      </div>
      <AppFooter
        activeHref="/history"
      />
    </div>
  );
}
