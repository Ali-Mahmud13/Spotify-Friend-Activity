export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          spotify_user_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
      };
      current_tracks: {
        Row: {
          user_id: string;
          track_id: string;
          track_name: string;
          artist_names: string;
          album_name: string | null;
          album_image_url: string | null;
          spotify_url: string | null;
          duration_ms: number | null;
          progress_ms: number | null;
          is_playing: boolean;
          fetched_at: string;
        };
      };
      recent_tracks: {
        Row: {
          id: string;
          user_id: string;
          track_id: string;
          track_name: string;
          artist_names: string;
          album_name: string | null;
          album_image_url: string | null;
          spotify_url: string | null;
          duration_ms: number | null;
          played_at: string;
          created_at: string;
        };
      };
      repeat_stats_7d: {
        Row: {
          user_id: string;
          track_id: string;
          track_name: string;
          artist_names: string;
          album_image_url: string | null;
          plays_last_7_days: number;
          last_played_at: string;
        };
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CurrentTrack =
  Database["public"]["Tables"]["current_tracks"]["Row"];
export type RecentTrack =
  Database["public"]["Tables"]["recent_tracks"]["Row"];
export type RepeatStat7d =
  Database["public"]["Tables"]["repeat_stats_7d"]["Row"];

export type CurrentListening = CurrentTrack & {
  profile: Profile;
};

export type RecentListening = RecentTrack & {
  profile: Profile;
};

export type RepeatStat = RepeatStat7d & {
  profile: Profile;
};

export type DashboardData = {
  current: CurrentListening[];
  recent: RecentListening[];
  repeats: RepeatStat[];
  usingDummyData: boolean;
};

export type DashboardUserGroup = {
  groupId: string;
  userIds: string[];
  profile: Profile;
  current: CurrentListening | null;
  recent: RecentListening[];
  repeats: RepeatStat[];
};
