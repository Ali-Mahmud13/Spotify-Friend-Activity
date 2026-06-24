"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { DashboardData } from "@/lib/types";
import { groupTracksByUser } from "@/lib/dashboard-groups";
import { useLiveDashboard } from "@/hooks/use-live-dashboard";
import { formatClockTime } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FriendOverviewCard } from "@/components/friend-overview-card";
import { FriendHighlights } from "@/components/friend-highlights";
import { RoomVibeCard } from "@/components/room-vibe-card";

export function DashboardLive({
  initialData,
  initialRefreshedAt
}: {
  initialData: DashboardData;
  initialRefreshedAt: string;
}) {
  const { data, lastRefreshedAt, refreshError } = useLiveDashboard(
    initialData,
    initialRefreshedAt
  );
  const userGroups = useMemo(() => groupTracksByUser(data), [data]);
  const listeningNow = userGroups.filter((group) => group.current?.is_playing).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_32px_100px_rgba(30,41,59,0.38)] backdrop-blur-xl md:p-8"
      >
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="blue">Private friend room</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Your circle&apos;s music mood, live.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              See who is listening, what vibe they are in, and whose queue is
              quietly becoming the group personality test.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-end">
            <StatPill label="Live now" value={listeningNow} />
            <StatPill label="Friends" value={userGroups.length} />
            <StatPill label="Refresh" value="15s" />
            {data.usingDummyData ? <StatPill label="Mode" value="Demo" /> : null}
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>Last refreshed {formatClockTime(lastRefreshedAt)}</span>
          {refreshError ? <span className="text-amber-200">{refreshError}</span> : null}
        </div>
      </motion.header>

      {userGroups.length > 0 ? (
        <>
          <RoomVibeCard groups={userGroups} />
          <FriendHighlights groups={userGroups} />

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Friends
                </h2>
                <p className="text-sm text-slate-400">
                  Tap a card to open their full music profile.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {userGroups.map((group) => (
                <FriendOverviewCard key={group.groupId} group={group} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-slate-300">
            No listening data yet. Once Supabase has tracks, this room will light up.
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-right">
      <p className="text-lg font-black text-cyan-100">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
