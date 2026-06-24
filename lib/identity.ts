import type { Profile } from "@/lib/types";

const UNKNOWN_LISTENER = "Unknown listener";

export function cleanImportedText(value: string | null | undefined) {
  const cleaned = value?.trim().replace(/^=+/, "").trim();

  return cleaned || null;
}

export function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    display_name: cleanImportedText(profile.display_name) ?? UNKNOWN_LISTENER,
    spotify_user_id: cleanImportedText(profile.spotify_user_id),
    avatar_url: cleanImportedText(profile.avatar_url)
  };
}

export function profileIdentityKey(profile: Profile, fallbackUserId: string) {
  const displayName = cleanImportedText(profile.display_name);
  const spotifyUserId = cleanImportedText(profile.spotify_user_id);

  if (displayName && displayName.toLowerCase() !== UNKNOWN_LISTENER.toLowerCase()) {
    return `name:${displayName.toLowerCase()}`;
  }

  if (spotifyUserId) {
    return `spotify:${spotifyUserId.toLowerCase()}`;
  }

  return `user:${fallbackUserId}`;
}

export function preferRicherProfile(current: Profile, next: Profile) {
  const normalizedCurrent = normalizeProfile(current);
  const normalizedNext = normalizeProfile(next);
  const currentScore =
    Number(Boolean(cleanImportedText(normalizedCurrent.spotify_user_id))) +
    Number(normalizedCurrent.display_name !== UNKNOWN_LISTENER) +
    Number(Boolean(cleanImportedText(normalizedCurrent.avatar_url)));
  const nextScore =
    Number(Boolean(cleanImportedText(normalizedNext.spotify_user_id))) +
    Number(normalizedNext.display_name !== UNKNOWN_LISTENER) +
    Number(Boolean(cleanImportedText(normalizedNext.avatar_url)));

  return nextScore > currentScore ? normalizedNext : normalizedCurrent;
}
