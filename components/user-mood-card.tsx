import type { DashboardUserGroup } from "@/lib/types";
import { getUserMood } from "@/lib/insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserMoodCard({ group }: { group: DashboardUserGroup }) {
  const mood = getUserMood(group);

  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${mood.accent}`}
      />
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>User Mood</CardTitle>
          <Badge variant="violet">{mood.energy}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black tracking-tight">{mood.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300/75">
          {mood.description}
        </p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-cyan-100">
          {mood.reason}
        </p>
      </CardContent>
    </Card>
  );
}
