import Image, { type StaticImageData } from "next/image";
import type { ProgressionMission } from "@/entities/progression";
import { MissionCard } from "./MissionCard";

export function MissionSection({
  icon,
  title,
  missions,
  pendingMissionId,
  onClaim,
}: {
  icon: StaticImageData;
  title: string;
  missions: ProgressionMission[];
  pendingMissionId: string | null;
  onClaim: (missionId: string) => void;
}) {
  return (
    <section className="w-full max-w-[864px] space-y-3">
      <h2 className="flex items-center gap-2 text-[14px] font-bold text-white">
        <Image
          src={icon}
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
        />
        {title}
      </h2>
      {missions.length ? (
        missions.map((mission) => (
          <MissionCard
            key={mission.key}
            mission={mission}
            isPending={pendingMissionId === mission.id}
            onClaim={onClaim}
          />
        ))
      ) : (
        <p className="rounded-[10px] border border-(--borderColor) bg-[rgba(30,36,56,0.55)] px-4 py-4 text-[14px] text-(--text)">
          No missions available.
        </p>
      )}
    </section>
  );
}
