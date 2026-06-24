"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import type { DashboardUserGroup } from "@/lib/types";
import { getInsightMetrics, getListeningPattern, getUserMood } from "@/lib/insights";
import { Avatar, AlbumImage } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function FriendOverviewCard({ group }: { group: DashboardUserGroup }) {
  const mood = getUserMood(group);
  const pattern = getListeningPattern(group);
  const metrics = getInsightMetrics(group);
  const href = `/users/${encodeURIComponent(group.userIds[0])}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link href={href} className="block focus:outline-none">
        <Card className="group h-full overflow-hidden transition hover:border-cyan-300/30 hover:bg-white/[0.075]">
          <div className="relative h-32 overflow-hidden">
            <AlbumImage
              src={group.current?.album_image_url ?? group.recent[0]?.album_image_url}
              title={group.current?.track_name ?? group.recent[0]?.track_name}
              size={360}
              className="h-full w-full object-cover opacity-70 blur-[1px] transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <Avatar
                src={group.profile.avatar_url}
                name={group.profile.display_name}
                size={54}
              />
              <div className="min-w-0">
                <p className="truncate text-xl font-black">
                  {group.profile.display_name}
                </p>
                <p className="truncate text-xs text-slate-300/75">
                  {group.profile.spotify_user_id ?? "Spotify friend"}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="space-y-4 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={group.current?.is_playing ? "default" : "muted"}>
                <Radio className="h-3.5 w-3.5" />
                {metrics.freshness}
              </Badge>
              <Badge variant="violet">{mood.title}</Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">
                {group.current?.track_name ?? group.recent[0]?.track_name ?? "No track yet"}
              </p>
              <p className="mt-1 truncate text-sm text-slate-400">
                {group.current?.artist_names ??
                  group.recent[0]?.artist_names ??
                  "Waiting for their next listen"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white/[0.045] p-2">
                <p className="font-black text-cyan-100">{pattern.recentCount}</p>
                <p className="text-[10px] text-slate-400">sample</p>
              </div>
              <div className="rounded-2xl bg-white/[0.045] p-2">
                <p className="font-black text-violet-100">{pattern.uniqueArtists}</p>
                <p className="text-[10px] text-slate-400">recent artists</p>
              </div>
              <div className="rounded-2xl bg-white/[0.045] p-2">
                <p className="font-black text-blue-100">{pattern.repeatPlays}</p>
                <p className="text-[10px] text-slate-400">loops</p>
              </div>
            </div>
            <p className="text-xs leading-5 text-slate-400">{mood.reason}</p>
            <div className="flex items-center justify-between text-sm font-bold text-cyan-100">
              <span>Open activity</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
