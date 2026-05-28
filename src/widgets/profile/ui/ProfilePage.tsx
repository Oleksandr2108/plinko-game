"use client";

import { useQuery } from "@tanstack/react-query";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import { ProfileStatCard } from "./ProfileStatCard";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { formatMemberSince, xpFormatter } from "./profileFormat";

export function ProfilePage() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: PLINKO_QUERY_KEYS.currentUser,
    queryFn: plinkoApi.getCurrentUser,
  });

  return (
    <main className="min-h-full bg-[#11161e]">
      <div className="mx-auto flex w-[calc(100%-32px)] max-w-[864px] flex-col gap-4 py-4">
        {isLoading ? (
          <p className="rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] p-4 text-[14px] text-(--text)">
            Loading profile...
          </p>
        ) : error ? (
          <p className="rounded-[10px] border border-(--borderColor) bg-[#301b29] p-4 text-[14px] text-(--colorError)">
            Failed to load profile. Please try again.
          </p>
        ) : user ? (
          <>
            <ProfileSummaryCard user={user} />
            <div className="grid gap-3 md:grid-cols-2">
              <ProfileStatCard
                label="Total XP"
                value={xpFormatter.format(user.progression.xp)}
              />
              <ProfileStatCard
                label="Member Since"
                value={formatMemberSince(user.createdAt)}
              />
            </div>
          </>
        ) : (
          <p className="rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] p-4 text-[14px] text-(--text)">
            No profile data available.
          </p>
        )}
      </div>
    </main>
  );
}
