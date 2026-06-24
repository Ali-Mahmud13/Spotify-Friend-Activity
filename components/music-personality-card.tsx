import type { DashboardUserGroup } from "@/lib/types";
import { getMusicPersonality } from "@/lib/insights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MusicPersonalityCard({ group }: { group: DashboardUserGroup }) {
  const personality = getMusicPersonality(group);

  return (
    <Card className="bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-cyan-300/10">
      <CardHeader>
        <CardTitle>Today&apos;s Music Personality</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black tracking-tight">{personality.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300/80">
          {personality.description}
        </p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-cyan-100">
          {personality.reason}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {personality.tags.map((tag) => (
            <Badge key={tag} variant="blue">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
