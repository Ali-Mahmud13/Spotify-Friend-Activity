import type { DashboardUserGroup } from "@/lib/types";
import { getRoomVibe } from "@/lib/insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function RoomVibeCard({ groups }: { groups: DashboardUserGroup[] }) {
  const roomVibe = getRoomVibe(groups);

  return (
    <Card className="relative overflow-hidden border-cyan-300/15">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${roomVibe.accent}`}
      />
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />
      <CardContent className="relative p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="blue">Today&apos;s Room Vibe</Badge>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {roomVibe.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300/80">
              {roomVibe.description}
            </p>
          </div>
          <p className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-cyan-100 md:max-w-xs">
            {roomVibe.reason}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
