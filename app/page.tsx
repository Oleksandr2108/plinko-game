import { BetPanel } from "@/widgets/bet-panel";
import { GameBoard } from "@/widgets/game-board";
import { GameHistory } from "@/widgets/game-history";

export default function Home() {
  return (
    <main>
      <BetPanel />
      <GameBoard />
      <GameHistory />
    </main>
  );
}
