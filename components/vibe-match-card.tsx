import type { DashboardUserGroup } from "@/lib/types";
import { getVibeMatch } from "@/lib/insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VibeMatchCard({
  group,
  groups
}: {
  group: DashboardUserGroup;
  groups: DashboardUserGroup[];
}) {
  const match = getVibeMatch(group, groups);

  return (
    <Card className="bg-gradient-to-br from-cyan-300/10 via-blue-500/10 to-violet-500/10">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Closest Vibe Today</CardTitle>
          {match ? <Badge>{match.score}% match</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        {match ? (
          <>
            <p className="text-2xl font-black">{match.profileName}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300/80">
              {match.detail}. Similar enough to feel connected, different enough
              to keep the queue interesting.
            </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-300/80">
            No clear match yet. A few more recent tracks will make this feel more
            accurate.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
