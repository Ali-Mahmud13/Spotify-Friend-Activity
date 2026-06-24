import type { DashboardUserGroup } from "@/lib/types";
import { getFriendHighlights } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FriendHighlights({ groups }: { groups: DashboardUserGroup[] }) {
  const highlights = getFriendHighlights(groups);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white/[0.075] to-white/[0.035]">
      <CardHeader>
        <CardTitle>Friendly Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.label}
              className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/70">
                {highlight.label}
              </p>
              <p className="mt-2 truncate text-lg font-black">
                {highlight.value}
              </p>
              <p className="mt-1 truncate text-sm text-slate-400">
                {highlight.detail}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
