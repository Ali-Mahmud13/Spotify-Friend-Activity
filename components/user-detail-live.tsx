"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { DashboardData } from "@/lib/types";
import { findUserGroup, groupTracksByUser } from "@/lib/dashboard-groups";
import { useLiveDashboard } from "@/hooks/use-live-dashboard";
import { Avatar, formatClockTime } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NowPlayingCard } from "@/components/now-playing-card";
import { RecentTracksList } from "@/components/recent-tracks-list";
import { RepeatSongsCard } from "@/components/repeat-songs-card";
import { UserMoodCard } from "@/components/user-mood-card";
import { ListeningPatternSummary } from "@/components/listening-pattern-summary";
import { MusicPersonalityCard } from "@/components/music-personality-card";
import { TasteSnapshotCard } from "@/components/taste-snapshot-card";
import { VibeMatchCard } from "@/components/vibe-match-card";

export function UserDetailLive({
  initialData,
  userId,
  initialRefreshedAt
}: {
  initialData: DashboardData;
  userId: string;
  initialRefreshedAt: string;
}) {
  const { data, lastRefreshedAt, refreshError } = useLiveDashboard(
    initialData,
    initialRefreshedAt
  );
  const groups = useMemo(() => groupTracksByUser(data), [data]);
  const group = useMemo(() => findUserGroup(data, userId), [data, userId]);

  if (!group) {
    return (
      <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-4">
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-2xl font-black">Friend not found</h1>
            <p className="text-slate-400">
              This profile may have been merged or is not active yet.
            </p>
            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_32px_100px_rgba(30,41,59,0.38)] backdrop-blur-xl md:p-8"
      >
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-28 left-8 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Button
              asChild
              variant="ghost"
              className="sticky top-3 z-10 -ml-3 mb-4 bg-slate-950/25 backdrop-blur"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Avatar
                src={group.profile.avatar_url}
                name={group.profile.display_name}
                size={70}
              />
              <div className="min-w-0">
                <h1 className="truncate text-4xl font-black tracking-tight sm:text-5xl">
                  {group.profile.display_name}
                </h1>
                <p className="mt-1 truncate text-sm text-slate-300/75">
                  {group.profile.spotify_user_id ?? "Spotify friend"}
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-400 sm:text-right">
            <p>Refreshes every 15 seconds</p>
            <p>Last updated {formatClockTime(lastRefreshedAt)}</p>
            {refreshError ? <p className="text-amber-200">{refreshError}</p> : null}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="space-y-5"
        >
          <NowPlayingCard track={group.current} />
          <MusicPersonalityCard group={group} />
          <UserMoodCard group={group} />
          <TasteSnapshotCard group={group} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="space-y-5"
        >
          <ListeningPatternSummary group={group} />
          <VibeMatchCard group={group} groups={groups} />
          <RecentTracksList tracks={group.recent} />
          <RepeatSongsCard songs={group.repeats} />
        </motion.div>
      </div>
    </main>
  );
}
