import { BetPanel } from "@/widgets/bet-panel";
import { GameBoard } from "@/widgets/game-board";
import { GameHistory } from "@/widgets/game-history/ui/GameHistory";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-[#11161e]">
      <BetPanel />
      
        <GameBoard />
        
    </main>
  );
}
