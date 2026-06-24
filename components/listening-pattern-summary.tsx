import type { DashboardUserGroup } from "@/lib/types";
import { getListeningPattern } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ListeningPatternSummary({
  group
}: {
  group: DashboardUserGroup;
}) {
  const pattern = getListeningPattern(group);
  const stats = [
    ["Recent plays", pattern.recentCount],
    ["Artist mix", pattern.uniqueArtists],
    ["Repeat plays", pattern.repeatPlays]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listening Pattern</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"
            >
              <p className="text-xl font-black text-cyan-100">{value}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300/75">
          {pattern.summary}
        </p>
        <p className="mt-3 text-xs font-semibold text-cyan-100">
          {pattern.reason}
        </p>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-violet-200/70">
          Top loop: {pattern.topRepeat}
        </p>
      </CardContent>
    </Card>
  );
}
