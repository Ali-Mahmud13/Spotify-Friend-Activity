import type {
  DashboardData,
  DashboardUserGroup,
  Profile,
  RecentListening,
  RepeatStat
} from "@/lib/types";
import {
  normalizeProfile,
  preferRicherProfile,
  profileIdentityKey
} from "@/lib/identity";
import type { CurrentListening } from "@/lib/types";

function currentTrackScore(track: CurrentListening) {
  const hasTrack = Boolean(track.track_id || track.track_name);
  const fetchedAt = new Date(track.fetched_at).getTime();

  return {
    hasTrack,
    isPlaying: track.is_playing,
    fetchedAt: Number.isNaN(fetchedAt) ? 0 : fetchedAt
  };
}

function shouldReplaceCurrentTrack(
  current: CurrentListening | null,
  next: CurrentListening
) {
  if (!current) {
    return true;
  }

  const currentScore = currentTrackScore(current);
  const nextScore = currentTrackScore(next);
  const nextIsMeaningfullyNewer =
    nextScore.fetchedAt - currentScore.fetchedAt > 90_000;

  if (nextIsMeaningfullyNewer) {
    return true;
  }

  if (currentScore.hasTrack !== nextScore.hasTrack) {
    return nextScore.hasTrack;
  }

  if (currentScore.isPlaying !== nextScore.isPlaying) {
    return nextScore.isPlaying;
  }

  return nextScore.fetchedAt >= currentScore.fetchedAt;
}

function getOrCreateGroup(
  groups: Map<string, DashboardUserGroup>,
  userId: string,
  profile: Profile
) {
  const normalizedProfile = normalizeProfile(profile);
  const groupId = profileIdentityKey(normalizedProfile, userId);
  const existingGroup = groups.get(groupId);

  if (existingGroup) {
    existingGroup.profile = preferRicherProfile(
      existingGroup.profile,
      normalizedProfile
    );

    if (!existingGroup.userIds.includes(userId)) {
      existingGroup.userIds.push(userId);
    }

    return existingGroup;
  }

  const group: DashboardUserGroup = {
    groupId,
    userIds: [userId],
    profile: normalizedProfile,
    current: null,
    recent: [],
    repeats: []
  };

  groups.set(groupId, group);

  return group;
}

export function groupTracksByUser(data: DashboardData) {
  const groups = new Map<string, DashboardUserGroup>();

  data.current.forEach((track) => {
    const group = getOrCreateGroup(groups, track.user_id, track.profile);

    if (shouldReplaceCurrentTrack(group.current, track)) {
      group.current = track;
    }
  });

  data.recent.forEach((track: RecentListening) => {
    getOrCreateGroup(groups, track.user_id, track.profile).recent.push(track);
  });

  data.repeats.forEach((song: RepeatStat) => {
    getOrCreateGroup(groups, song.user_id, song.profile).repeats.push(song);
  });

  return Array.from(groups.values()).sort((a, b) =>
    a.profile.display_name.localeCompare(b.profile.display_name)
  );
}

export function findUserGroup(data: DashboardData, userId: string) {
  return groupTracksByUser(data).find(
    (group) => group.userIds.includes(userId) || group.groupId === userId
  );
}
