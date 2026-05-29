"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/entities/user";
import { useUserStore } from "@/entities/user";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import AddAvatarIcon from "../../../../public/icons/profile_avatarIcon.svg";
import ProgressIcon from "../../../../public/icons/progress_Level.svg";
import { AvatarUploadModal } from "./AvatarUploadModal";
import BetIcon from "../../../../public/icons/betIcon.svg";

import EditIcon from "../../../../public/icons/profile_edidIcon.svg";
import LevelIcon from "../../../../public/icons/profile_levelIcon.svg";
import StreakIcon from "../../../../public/icons/profile_streakIcon.svg";
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
      <section className="rounded-[10px] border border-(--borderColor) bg-(--bgSurface) p-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-(--colorAccess) text-[28px] font-bold text-(--colorWhite) transition hover:brightness-110"
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
                (user.nickname?.[0]?.toUpperCase() ?? "U")
              )}
              <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--bgSurface) bg-(--colorAccess)">
                <Image
                  src={AddAvatarIcon}
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
                    className="min-w-0 rounded-[8px] border border-(--borderColor) bg-(--bgPage) px-3 py-2 text-[14px] text-(--colorWhite) outline-none focus:border-(--colorAccess)"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNickname}
                    disabled={updateProfileMutation.isPending}
                    className="rounded-[8px] bg-(--colorAccess) px-3 py-2 text-[12px] font-bold text-(--colorWhite) disabled:opacity-60"
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
                  <h2 className="truncate text-[20px] font-bold text-(--colorWhite)">
                    {user.nickname}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedNickname(user.nickname);
                      setIsEditingNickname(true);
                    }}
                    aria-label="Edit nickname"
                    className="cursor-pointer"
                  >
                    <Image
                      src={EditIcon}
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </button>
                </div>
              )}
              <p className="mt-1 truncate text-[14px] text-(--text)">
                {user.email}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-(--secondaryText)">
                <span className="inline-flex items-center gap-1">
                  <Image
                    src={LevelIcon}
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
            <p className="inline-flex items-center gap-1 text-[12px] font-bold text-(--colorWhite)">
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
          <div className="h-2 overflow-hidden rounded-full bg-(--bgTrack)">
            <div
              className="h-full rounded-full [background:var(--progressGradient)] transition-[width]"
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
