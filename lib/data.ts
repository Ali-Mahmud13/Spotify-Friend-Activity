import { dummyDashboardData } from "@/lib/dummy-data";
import { createSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import type {
  CurrentListening,
  CurrentTrack,
  DashboardData,
  Profile,
  RecentListening,
  RecentTrack,
  RepeatStat,
  RepeatStat7d
} from "@/lib/types";
import { normalizeProfile } from "@/lib/identity";

const PROFILE_COLUMNS = "id, display_name, spotify_user_id, avatar_url, created_at";
const CURRENT_TRACK_COLUMNS =
  "user_id, track_id, track_name, artist_names, album_name, album_image_url, spotify_url, duration_ms, progress_ms, is_playing, fetched_at";
const RECENT_TRACK_COLUMNS =
  "id, user_id, track_id, track_name, artist_names, album_name, album_image_url, spotify_url, duration_ms, played_at, created_at";
const REPEAT_STATS_COLUMNS =
  "user_id, track_id, track_name, artist_names, album_image_url, plays_last_7_days, last_played_at";
const CURRENT_TRACK_WITH_PROFILE_COLUMNS = `${CURRENT_TRACK_COLUMNS}, profile:profiles(${PROFILE_COLUMNS})`;

const UNKNOWN_PROFILE_CREATED_AT = "1970-01-01T00:00:00.000Z";
const RECENT_TRACK_FETCH_LIMIT = 100;
const REPEAT_STATS_FETCH_LIMIT = 100;

type SupabaseClient = NonNullable<ReturnType<typeof createSupabaseClient>>;
type CurrentTrackWithProfile = CurrentTrack & {
  profile?: Profile | null;
  profiles?: Profile | Profile[] | null;
};

function warnAndUseDummy(source: string, message?: string) {
  console.warn(
    `Falling back to dummy ${source} data.${message ? ` ${message}` : ""}`
  );
}

function buildUnknownProfile(userId: string): Profile {
  return normalizeProfile({
    id: userId,
    display_name: "Unknown listener",
    spotify_user_id: null,
    avatar_url: null,
    created_at: UNKNOWN_PROFILE_CREATED_AT
  });
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function profileFromJoinedRow(row: CurrentTrackWithProfile) {
  if (row.profile) {
    return row.profile;
  }

  if (Array.isArray(row.profiles)) {
    return row.profiles[0] ?? null;
  }

  return row.profiles ?? null;
}

function toCurrentTrack(row: CurrentTrackWithProfile): CurrentTrack {
  return {
    user_id: row.user_id,
    track_id: row.track_id,
    track_name: row.track_name,
    artist_names: row.artist_names,
    album_name: row.album_name,
    album_image_url: row.album_image_url,
    spotify_url: row.spotify_url,
    duration_ms: row.duration_ms,
    progress_ms: row.progress_ms,
    is_playing: row.is_playing,
    fetched_at: row.fetched_at
  };
}

function attachProfile<T extends { user_id: string }>(
  rows: T[],
  profiles: Profile[]
) {
  const profilesById = new Map(
    profiles.map((profile) => [profile.id, normalizeProfile(profile)])
  );

  return rows.map((row) => ({
    ...row,
    profile: profilesById.get(row.user_id) ?? buildUnknownProfile(row.user_id)
  }));
}

async function getProfilesByUserIds(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Profile[]> {
  const uniqueUserIds = uniqueValues(userIds);

  if (uniqueUserIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .in("id", uniqueUserIds)
    .order("display_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as Profile[]).map(normalizeProfile);
}

export async function getProfiles(): Promise<Profile[]> {
  if (!hasSupabaseConfig()) {
    return uniqueValues(dummyDashboardData.current.map((track) => track.user_id))
      .map((userId) => dummyDashboardData.current.find((track) => track.user_id === userId))
      .flatMap((track) => (track ? [normalizeProfile(track.profile)] : []));
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data: currentTracks, error: currentTracksError } = await supabase
    .from("current_tracks")
    .select("user_id");

  if (currentTracksError) {
    warnAndUseDummy("profiles", currentTracksError.message);
    return dummyDashboardData.current.map((track) => normalizeProfile(track.profile));
  }

  try {
    const currentTrackUserIds = ((currentTracks ?? []) as Array<{ user_id: string }>)
      .map((track) => track.user_id);

    return getProfilesByUserIds(
      supabase,
      currentTrackUserIds
    );
  } catch (error) {
    warnAndUseDummy("profiles", error instanceof Error ? error.message : undefined);
    return dummyDashboardData.current.map((track) => normalizeProfile(track.profile));
  }
}

export async function getCurrentTracks(): Promise<CurrentListening[]> {
  if (!hasSupabaseConfig()) {
    return dummyDashboardData.current;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return dummyDashboardData.current;
  }

  const joinedResult = await supabase
    .from("current_tracks")
    .select(CURRENT_TRACK_WITH_PROFILE_COLUMNS)
    .order("fetched_at", { ascending: false });

  if (!joinedResult.error) {
    return ((joinedResult.data ?? []) as CurrentTrackWithProfile[]).map((row) => ({
      ...toCurrentTrack(row),
      profile: normalizeProfile(profileFromJoinedRow(row) ?? buildUnknownProfile(row.user_id))
    }));
  }

  const { data: currentTracks, error: currentTracksError } = await supabase
    .from("current_tracks")
    .select(CURRENT_TRACK_COLUMNS)
    .order("fetched_at", { ascending: false });

  if (currentTracksError) {
    warnAndUseDummy("current_tracks", currentTracksError.message);
    return dummyDashboardData.current;
  }

  try {
    const tracks = (currentTracks ?? []) as CurrentTrack[];
    const profiles = await getProfilesByUserIds(
      supabase,
      tracks.map((track) => track.user_id)
    );

    return attachProfile(tracks, profiles);
  } catch (error) {
    warnAndUseDummy(
      "current_tracks",
      error instanceof Error ? error.message : joinedResult.error.message
    );
    return dummyDashboardData.current;
  }
}

export async function getRecentTracks(): Promise<RecentListening[]> {
  if (!hasSupabaseConfig()) {
    return dummyDashboardData.recent;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return dummyDashboardData.recent;
  }

  const { data, error } = await supabase
    .from("recent_tracks")
    .select(RECENT_TRACK_COLUMNS)
    .order("played_at", { ascending: false })
    .limit(RECENT_TRACK_FETCH_LIMIT);

  if (error) {
    warnAndUseDummy("recent_tracks", error.message);
    return dummyDashboardData.recent;
  }

  try {
    const tracks = (data ?? []) as RecentTrack[];
    const profiles = await getProfilesByUserIds(
      supabase,
      tracks.map((track) => track.user_id)
    );

    return attachProfile(tracks, profiles);
  } catch (profileError) {
    warnAndUseDummy(
      "recent_tracks",
      profileError instanceof Error ? profileError.message : undefined
    );
    return attachProfile((data ?? []) as RecentTrack[], []);
  }
}

export async function getRepeatStats(): Promise<RepeatStat[]> {
  if (!hasSupabaseConfig()) {
    return dummyDashboardData.repeats;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return dummyDashboardData.repeats;
  }

  const { data, error } = await supabase
    .from("repeat_stats_7d")
    .select(REPEAT_STATS_COLUMNS)
    .order("plays_last_7_days", { ascending: false })
    .limit(REPEAT_STATS_FETCH_LIMIT);

  if (error) {
    warnAndUseDummy("repeat_stats_7d", error.message);
    return dummyDashboardData.repeats;
  }

  try {
    const stats = (data ?? []) as RepeatStat7d[];
    const profiles = await getProfilesByUserIds(
      supabase,
      stats.map((stat) => stat.user_id)
    );

    return attachProfile(stats, profiles);
  } catch (profileError) {
    warnAndUseDummy(
      "repeat_stats_7d",
      profileError instanceof Error ? profileError.message : undefined
    );
    return attachProfile((data ?? []) as RepeatStat7d[], []);
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasSupabaseConfig()) {
    return dummyDashboardData;
  }

  const [current, recent, repeats] = await Promise.all([
    getCurrentTracks(),
    getRecentTracks(),
    getRepeatStats()
  ]);

  return {
    current,
    recent,
    repeats,
    usingDummyData:
      current === dummyDashboardData.current ||
      recent === dummyDashboardData.recent ||
      repeats === dummyDashboardData.repeats
  };
}
