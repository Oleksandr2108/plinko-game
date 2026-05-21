import { BetPanel } from "@/widgets/bet-panel";
import { GameBoard } from "@/widgets/game-board";
import { Header } from "@/widgets/header/ui/Header";

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-[#11161e]">
      <BetPanel />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <GameBoard />
      </div>
    </main>
  );
}
