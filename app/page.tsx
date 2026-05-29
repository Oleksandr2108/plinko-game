import { BetPanel, MobileBetPanel } from "@/widgets/bet-panel";
import { AppFooter } from "@/widgets/footer";
import { GameBoard } from "@/widgets/game-board";
import { Header } from "@/widgets/header/ui/Header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-(--bgPage)">
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <BetPanel className="hidden md:flex" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <GameBoard />
        </div>
      </main>
      <MobileBetPanel />
      <AppFooter />
    </div>
  );
}
