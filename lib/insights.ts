import type { DashboardUserGroup, RecentListening, RepeatStat } from "@/lib/types";

export type InsightMetrics = {
  recentPlayCount: number;
  uniqueRecentArtists: number;
  repeatPlayTotal: number;
  repeatTrackCount: number;
  topRepeatTrack: RepeatStat | null;
  latestActivityAt: string | null;
  latestActivityAgeMinutes: number | null;
  freshness: "Live" | "Fresh listen" | "Active today" | "Quiet mode";
  isLive: boolean;
};

export type UserMood = {
  title: string;
  description: string;
  reason: string;
  accent: string;
  energy: "Chill" | "Warm" | "Bright" | "Electric";
};

export type MusicPersonality = {
  title: string;
  description: string;
  reason: string;
  tags: string[];
};

export type ListeningPattern = {
  uniqueArtists: number;
  repeatPlays: number;
  recentCount: number;
  topRepeat: string;
  freshness: InsightMetrics["freshness"];
  summary: string;
  reason: string;
};

export type TasteSnapshot = {
  varietyScore: number;
  repeatEnergyScore: number;
  freshnessScore: number;
  streakFeel: InsightMetrics["freshness"];
};

export type RoomVibe = {
  title: string;
  description: string;
  reason: string;
  accent: string;
};

export type FriendHighlight = {
  label: string;
  value: string;
  detail: string;
};

export type VibeMatch = {
  profileName: string;
  score: number;
  detail: string;
} | null;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function splitArtists(artistNames: string | null | undefined) {
  return String(artistNames ?? "")
    .split(",")
    .map((artist) => artist.trim().toLowerCase())
    .filter(Boolean);
}

function recentArtistSet(group: DashboardUserGroup) {
  return new Set(group.recent.flatMap((track) => splitArtists(track.artist_names)));
}

function latestRecentTrack(group: DashboardUserGroup) {
  return [...group.recent].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  )[0];
}

function latestActivityTime(group: DashboardUserGroup) {
  const timestamps = [
    group.current?.fetched_at,
    latestRecentTrack(group)?.played_at
  ]
    .filter(Boolean)
    .map((value) => new Date(String(value)).getTime())
    .filter((value) => !Number.isNaN(value));

  return timestamps.length > 0 ? Math.max(...timestamps) : null;
}

export function getInsightMetrics(group: DashboardUserGroup): InsightMetrics {
  const topRepeatTrack =
    [...group.repeats].sort(
      (a, b) => b.plays_last_7_days - a.plays_last_7_days
    )[0] ?? null;
  const latestActivityMs = latestActivityTime(group);
  const latestActivityAgeMinutes =
    latestActivityMs === null
      ? null
      : Math.max(0, Math.round((Date.now() - latestActivityMs) / 60000));
  const isLive = Boolean(group.current?.is_playing);
  const freshness = isLive
    ? "Live"
    : latestActivityAgeMinutes === null
      ? "Quiet mode"
      : latestActivityAgeMinutes <= 30
        ? "Fresh listen"
        : latestActivityAgeMinutes <= 24 * 60
          ? "Active today"
          : "Quiet mode";

  return {
    recentPlayCount: group.recent.length,
    uniqueRecentArtists: recentArtistSet(group).size,
    repeatPlayTotal: group.repeats.reduce(
      (total, song) => total + song.plays_last_7_days,
      0
    ),
    repeatTrackCount: group.repeats.length,
    topRepeatTrack,
    latestActivityAt:
      latestActivityMs === null ? null : new Date(latestActivityMs).toISOString(),
    latestActivityAgeMinutes,
    freshness,
    isLive
  };
}

export function getListeningPattern(group: DashboardUserGroup): ListeningPattern {
  const metrics = getInsightMetrics(group);

  return {
    uniqueArtists: metrics.uniqueRecentArtists,
    repeatPlays: metrics.repeatPlayTotal,
    recentCount: metrics.recentPlayCount,
    topRepeat: metrics.topRepeatTrack?.track_name ?? "No loop yet",
    freshness: metrics.freshness,
    summary:
      metrics.repeatPlayTotal >= 18
        ? "Their week has a clear soundtrack, and a few songs are doing heavy lifting."
        : metrics.uniqueRecentArtists >= 8
          ? "Their recent queue has range, color, and a healthy curiosity streak."
          : metrics.isLive
            ? "They are present right now, keeping the room feeling awake."
            : "Their listening feels focused, cozy, and easy to sit with.",
    reason:
      metrics.repeatPlayTotal >= 18
        ? `because ${metrics.repeatPlayTotal} repeat plays are showing up`
        : metrics.uniqueRecentArtists >= 8
          ? `because ${metrics.uniqueRecentArtists} recent artists are in rotation`
          : `because ${metrics.recentPlayCount} sampled recent plays are available`
  };
}

export function getUserMood(group: DashboardUserGroup): UserMood {
  const metrics = getInsightMetrics(group);

  if (metrics.isLive && metrics.repeatPlayTotal >= 14) {
    return {
      title: "Main Character Loop",
      description: "Live right now and clearly attached to the soundtrack.",
      reason: `because they are live with ${metrics.repeatPlayTotal} repeat plays`,
      accent: "from-fuchsia-400 to-violet-500",
      energy: "Electric"
    };
  }

  if (metrics.isLive) {
    return {
      title: "Neon Night",
      description: "Currently tuned in with a clean, late-night glow.",
      reason: "because they are listening right now",
      accent: "from-cyan-300 to-blue-500",
      energy: "Bright"
    };
  }

  if (metrics.uniqueRecentArtists >= 8) {
    return {
      title: "Discovery Mode",
      description: "Lots of variety, but somehow the taste still makes sense.",
      reason: `because ${metrics.uniqueRecentArtists} recent artists showed up`,
      accent: "from-indigo-300 to-cyan-400",
      energy: "Bright"
    };
  }

  if (metrics.repeatPlayTotal >= 10) {
    return {
      title: "Soft Obsession",
      description: "One or two tracks are carrying the whole emotional arc.",
      reason: `because ${metrics.repeatPlayTotal} repeat plays are logged`,
      accent: "from-violet-300 to-purple-500",
      energy: "Warm"
    };
  }

  return {
    title: "Dream Mode",
    description: "Low-key, floaty, and very easy to sit with.",
    reason: `because the current sample is ${metrics.freshness.toLowerCase()}`,
    accent: "from-sky-300 to-indigo-400",
    energy: "Chill"
  };
}

export function getMusicPersonality(group: DashboardUserGroup): MusicPersonality {
  const metrics = getInsightMetrics(group);
  const mood = getUserMood(group);

  if (metrics.repeatPlayTotal >= 16) {
    return {
      title: "The Repeat Romantic",
      description: "When a song hits, they let it become the whole weather.",
      reason: `because ${metrics.repeatPlayTotal} repeat plays are in the sample`,
      tags: ["loyal queue", "big feelings", mood.energy.toLowerCase()]
    };
  }

  if (metrics.uniqueRecentArtists >= 8) {
    return {
      title: "The Playlist Explorer",
      description: "Always testing new corners of the vibe map.",
      reason: `because ${metrics.uniqueRecentArtists} recent artists are rotating`,
      tags: ["variety", "taste scout", mood.energy.toLowerCase()]
    };
  }

  if (metrics.isLive) {
    return {
      title: "The Live Curator",
      description: "Their soundtrack is happening right now, no context needed.",
      reason: "because their current track is live",
      tags: ["live", "present", mood.energy.toLowerCase()]
    };
  }

  return {
    title: "The Calm Collector",
    description: "A focused listener with a queue that knows what it wants.",
    reason: `because their sample is ${metrics.freshness.toLowerCase()}`,
    tags: ["cozy", "selective", mood.energy.toLowerCase()]
  };
}

export function getTasteSnapshot(group: DashboardUserGroup): TasteSnapshot {
  const metrics = getInsightMetrics(group);
  const freshnessScore =
    metrics.freshness === "Live"
      ? 100
      : metrics.freshness === "Fresh listen"
        ? 82
        : metrics.freshness === "Active today"
          ? 58
          : 24;

  return {
    varietyScore: clamp(Math.round((metrics.uniqueRecentArtists / 10) * 100)),
    repeatEnergyScore: clamp(Math.round((metrics.repeatPlayTotal / 24) * 100)),
    freshnessScore,
    streakFeel: metrics.freshness
  };
}

export function getRoomVibe(groups: DashboardUserGroup[]): RoomVibe {
  const metrics = groups.map(getInsightMetrics);
  const liveCount = metrics.filter((metric) => metric.isLive).length;
  const repeatTotal = metrics.reduce(
    (total, metric) => total + metric.repeatPlayTotal,
    0
  );
  const artistTotal = metrics.reduce(
    (total, metric) => total + metric.uniqueRecentArtists,
    0
  );

  if (liveCount >= Math.max(1, Math.ceil(groups.length / 2))) {
    return {
      title: "Neon Night",
      description: "The room feels switched on, live, and a little cinematic.",
      reason: `${liveCount} friend${liveCount === 1 ? " is" : "s are"} live now`,
      accent: "from-cyan-300 via-blue-400 to-violet-500"
    };
  }

  if (repeatTotal >= groups.length * 12) {
    return {
      title: "Loop Era",
      description: "The group has favorites, and those favorites are not leaving soon.",
      reason: `${repeatTotal} repeat plays across the sampled week`,
      accent: "from-fuchsia-400 via-violet-400 to-indigo-500"
    };
  }

  if (artistTotal >= groups.length * 6) {
    return {
      title: "Discovery Mode",
      description: "Everyone is wandering through different corners of the map.",
      reason: `${artistTotal} recent artist slots across the room`,
      accent: "from-sky-300 via-cyan-300 to-blue-500"
    };
  }

  return {
    title: "Chill Room",
    description: "Soft signal, clean taste, and no one trying too hard.",
    reason: "based on the current sample of friends and recent plays",
    accent: "from-indigo-300 via-blue-400 to-cyan-300"
  };
}

export function getFriendHighlights(groups: DashboardUserGroup[]): FriendHighlight[] {
  const withMetrics = groups.map((group) => ({
    group,
    metrics: getInsightMetrics(group)
  }));
  const freshest = [...withMetrics].sort(
    (a, b) =>
      (a.metrics.latestActivityAgeMinutes ?? Number.MAX_SAFE_INTEGER) -
      (b.metrics.latestActivityAgeMinutes ?? Number.MAX_SAFE_INTEGER)
  )[0];
  const biggestLoop = [...withMetrics].sort(
    (a, b) => b.metrics.repeatPlayTotal - a.metrics.repeatPlayTotal
  )[0];
  const mostVariety = [...withMetrics].sort(
    (a, b) => b.metrics.uniqueRecentArtists - a.metrics.uniqueRecentArtists
  )[0];
  const live = withMetrics.find((entry) => entry.metrics.isLive);

  return [
    {
      label: "Freshest listen",
      value: freshest?.group.profile.display_name ?? "No one yet",
      detail: freshest?.metrics.isLive
        ? "live right now"
        : `${freshest?.metrics.latestActivityAgeMinutes ?? 0}m since last signal`
    },
    {
      label: "Biggest loop",
      value: biggestLoop?.group.profile.display_name ?? "No one yet",
      detail: biggestLoop?.metrics.topRepeatTrack
        ? `${biggestLoop.metrics.topRepeatTrack.track_name} is leading`
        : "no repeat sample yet"
    },
    {
      label: "Most variety",
      value: mostVariety?.group.profile.display_name ?? "No one yet",
      detail: `${mostVariety?.metrics.uniqueRecentArtists ?? 0} recent artists`
    },
    {
      label: "Currently live",
      value: live?.group.profile.display_name ?? "Quiet room",
      detail: live?.group.current?.track_name ?? "waiting for the next play"
    }
  ];
}

function trackTokens(track: RecentListening) {
  return [
    track.track_id,
    track.track_name.toLowerCase(),
    ...splitArtists(track.artist_names)
  ].filter(Boolean);
}

export function getVibeMatch(
  group: DashboardUserGroup,
  groups: DashboardUserGroup[]
): VibeMatch {
  const sourceTokens = new Set(group.recent.flatMap(trackTokens));

  if (sourceTokens.size === 0) {
    return null;
  }

  const scored = groups
    .filter((candidate) => candidate.groupId !== group.groupId)
    .map((candidate) => {
      const candidateTokens = new Set(candidate.recent.flatMap(trackTokens));
      const overlap = Array.from(sourceTokens).filter((token) =>
        candidateTokens.has(token)
      ).length;
      const denominator = Math.max(sourceTokens.size, candidateTokens.size, 1);

      return {
        candidate,
        score: Math.round((overlap / denominator) * 100)
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score === 0) {
    return null;
  }

  return {
    profileName: best.candidate.profile.display_name,
    score: best.score,
    detail: `${best.score}% overlap in recent artists/tracks`
  };
}
