import type { DashboardData, Profile } from "@/lib/types";

const now = Date.now();

function minutesAgo(minutes: number) {
  return new Date(now - minutes * 60 * 1000).toISOString();
}

function daysAgo(days: number) {
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}

function slug(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const profiles: Profile[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    display_name: "Maya",
    spotify_user_id: "maya.spotify",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    created_at: daysAgo(120)
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    display_name: "Leo",
    spotify_user_id: "leo.spotify",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    created_at: daysAgo(98)
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    display_name: "Nora",
    spotify_user_id: "nora.spotify",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    created_at: daysAgo(80)
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    display_name: "Sam",
    spotify_user_id: "sam.spotify",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    created_at: daysAgo(64)
  }
];

const covers = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=400&q=80"
];

const recentSeed = [
  [profiles[2], "Bad Habit", "Steve Lacy"],
  [profiles[0], "Dreams", "Fleetwood Mac"],
  [profiles[3], "Electric Feel", "MGMT"],
  [profiles[1], "Dog Days Are Over", "Florence + The Machine"],
  [profiles[0], "Everything In Its Right Place", "Radiohead"],
  [profiles[2], "Nights", "Frank Ocean"],
  [profiles[3], "1901", "Phoenix"],
  [profiles[1], "Rebellion (Lies)", "Arcade Fire"],
  [profiles[0], "There Is a Light That Never Goes Out", "The Smiths"],
  [profiles[3], "Eventually", "Tame Impala"]
] as const;

const repeatSeed = [
  [profiles[0], "Dreams", "Fleetwood Mac", 12],
  [profiles[1], "Sweet Disposition", "The Temper Trap", 10],
  [profiles[3], "The Less I Know The Better", "Tame Impala", 9],
  [profiles[2], "Nights", "Frank Ocean", 8],
  [profiles[0], "Midnight City", "M83", 7]
] as const;

export const dummyDashboardData: DashboardData = {
  usingDummyData: true,
  current: [
    {
      user_id: profiles[0].id,
      track_id: "m83-midnight-city",
      profile: profiles[0],
      track_name: "Midnight City",
      artist_names: "M83",
      album_name: "Hurry Up, We're Dreaming",
      album_image_url: covers[0],
      spotify_url: null,
      duration_ms: 244000,
      progress_ms: 97000,
      is_playing: true,
      fetched_at: minutesAgo(1)
    },
    {
      user_id: profiles[1].id,
      track_id: "temper-trap-sweet-disposition",
      profile: profiles[1],
      track_name: "Sweet Disposition",
      artist_names: "The Temper Trap",
      album_name: "Conditions",
      album_image_url: covers[1],
      spotify_url: null,
      duration_ms: 230000,
      progress_ms: 153000,
      is_playing: true,
      fetched_at: minutesAgo(2)
    },
    {
      user_id: profiles[2].id,
      track_id: "frank-ocean-pink-white",
      profile: profiles[2],
      track_name: "Pink + White",
      artist_names: "Frank Ocean",
      album_name: "Blonde",
      album_image_url: covers[2],
      spotify_url: null,
      duration_ms: 184000,
      progress_ms: 0,
      is_playing: false,
      fetched_at: minutesAgo(9)
    },
    {
      user_id: profiles[3].id,
      track_id: "tame-impala-less-i-know",
      profile: profiles[3],
      track_name: "The Less I Know The Better",
      artist_names: "Tame Impala",
      album_name: "Currents",
      album_image_url: covers[3],
      spotify_url: null,
      duration_ms: 216000,
      progress_ms: 61000,
      is_playing: true,
      fetched_at: minutesAgo(1)
    }
  ],
  recent: recentSeed.map(([profile, trackName, artistNames], index) => ({
    id: `55555555-5555-4555-8555-${String(index).padStart(12, "0")}`,
    user_id: profile.id,
    track_id: slug(`${trackName}-${artistNames}`),
    profile,
    track_name: trackName,
    artist_names: artistNames,
    album_name: null,
    album_image_url: covers[index % covers.length],
    spotify_url: null,
    duration_ms: 210000 + index * 1000,
    played_at: minutesAgo((index + 3) * 7),
    created_at: minutesAgo((index + 2) * 7)
  })),
  repeats: repeatSeed.map(([profile, trackName, artistNames, plays], index) => ({
    user_id: profile.id,
    track_id: slug(`${trackName}-${artistNames}`),
    profile,
    track_name: trackName,
    artist_names: artistNames,
    album_image_url: covers[index % covers.length],
    plays_last_7_days: plays,
    last_played_at: minutesAgo((index + 1) * 22)
  }))
};
