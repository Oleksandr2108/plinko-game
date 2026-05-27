"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import BetIcon from "../../../../public/icons/betIcon.svg";
import ProgressIcon from "../../../../public/icons/progress_Level.svg";
import StreakIcon from "../../../../public/icons/progress_DailyRewardStreak.svg";
import { AvatarUploadModal } from "./AvatarUploadModal";
import {
  creditFormatter,
  getLevelProgressPercent,
  xpFormatter,
} from "./profileFormat";

export function ProfileSummaryCard({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editedNickname, setEditedNickname] = useState(user.nickname);
  const levelRange = Math.max(
    1,
    user.progression.xpForNextLevel - user.progression.xpForCurrentLevel,
  );
  const progressPercent = getLevelProgressPercent(user.progression);

  const updateProfileMutation = useMutation({
    mutationFn: (nickname: string) => plinkoApi.updateProfile({ nickname }),
    onSuccess: (updatedUser) => {
      const userWithCreatedAt = {
        ...updatedUser,
        createdAt: updatedUser.createdAt ?? user.createdAt,
      };
      queryClient.setQueryData(
        PLINKO_QUERY_KEYS.currentUser,
        userWithCreatedAt,
      );
      setUser(userWithCreatedAt);
      setIsEditingNickname(false);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (image: File) => plinkoApi.uploadAvatar(image),
    onSuccess: (updatedUser) => {
      const userWithCreatedAt = {
        ...updatedUser,
        createdAt: updatedUser.createdAt ?? user.createdAt,
      };
      queryClient.setQueryData(
        PLINKO_QUERY_KEYS.currentUser,
        userWithCreatedAt,
      );
      setUser(userWithCreatedAt);
    },
  });

  const handleSaveNickname = async () => {
    const nextNickname = editedNickname.trim();

    if (!nextNickname || nextNickname === user.nickname) {
      setEditedNickname(user.nickname);
      setIsEditingNickname(false);
      return;
    }

    await updateProfileMutation.mutateAsync(nextNickname);
  };

  const handleAvatarUpload = async (file: File) => {
    await uploadAvatarMutation.mutateAsync(file);
    setIsAvatarModalOpen(false);
  };

  return (
    <>
      <section className="rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] p-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-(--colorAccess) text-[28px] font-bold text-white transition hover:brightness-110"
              aria-label="Upload avatar"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.nickname}
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.nickname?.[0]?.toUpperCase() ?? "U"
              )}
              <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1a1f2e] bg-(--colorAccess)">
                <Image
                  src={BetIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </span>
            </button>

            <div className="min-w-0">
              {isEditingNickname ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={editedNickname}
                    onChange={(event) => setEditedNickname(event.target.value)}
                    className="min-w-0 rounded-[8px] border border-(--borderColor) bg-[#11161e] px-3 py-2 text-[14px] text-white outline-none focus:border-(--colorAccess)"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNickname}
                    disabled={updateProfileMutation.isPending}
                    className="rounded-[8px] bg-(--colorAccess) px-3 py-2 text-[12px] font-bold text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedNickname(user.nickname);
                      setIsEditingNickname(false);
                    }}
                    className="rounded-[8px] border border-(--borderColor) px-3 py-2 text-[12px] text-(--text)"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[20px] font-bold text-white">
                    {user.nickname}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedNickname(user.nickname);
                      setIsEditingNickname(true);
                    }}
                    aria-label="Edit nickname"
                    className="relative h-5 w-5 text-(--text) before:absolute before:left-[3px] before:top-[12px] before:h-px before:w-3 before:rotate-[-45deg] before:bg-current after:absolute after:left-[8px] after:top-[5px] after:h-2 after:w-px after:rotate-45 after:bg-current"
                  />
                </div>
              )}
              <p className="mt-1 truncate text-[14px] text-(--text)">
                {user.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-(--secondaryText)">
                <span className="inline-flex items-center gap-1">
                  <Image
                    src={ProgressIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  Level {user.progression.level}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Image
                    src={StreakIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  {user.progression.dailyStreak} day streak
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[12px] text-(--colorSmallText)">Balance</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[20px] font-bold text-(--colorAccess)">
              <Image
                src={BetIcon}
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              {creditFormatter.format(user.balance)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="inline-flex items-center gap-1 text-[12px] font-bold text-white">
              <Image
                src={ProgressIcon}
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              Level {user.progression.level} Progress
            </p>
            <p className="text-[12px] text-(--text)">
              {xpFormatter.format(user.progression.xpIntoCurrentLevel)} /{" "}
              {xpFormatter.format(levelRange)} XP
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#0d1118]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#2b7fff_0%,#ad46ff_100%)] transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        isPending={uploadAvatarMutation.isPending}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpload={handleAvatarUpload}
      />
    </>
  );
}
