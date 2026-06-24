import type { DashboardUserGroup } from "@/lib/types";
import { getTasteSnapshot } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TasteSnapshotCard({ group }: { group: DashboardUserGroup }) {
  const snapshot = getTasteSnapshot(group);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taste Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Meter label="Variety" value={snapshot.varietyScore} />
        <Meter label="Repeat energy" value={snapshot.repeatEnergyScore} />
        <Meter label="Freshness" value={snapshot.freshnessScore} />
        <p className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-cyan-100">
          Listening streak feel: {snapshot.streakFeel}
        </p>
      </CardContent>
    </Card>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
