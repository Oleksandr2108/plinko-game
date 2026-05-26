import { AppFooter } from "@/widgets/footer";
import { ProgressPage } from "@/widgets/progress";

export default function Progress() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <ProgressPage />
      </div>
      <AppFooter activeHref="/progress" />
    </div>
  );
}
