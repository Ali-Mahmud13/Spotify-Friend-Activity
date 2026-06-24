"use client";

import { useEffect, useState } from "react";
import type { CurrentListening } from "@/lib/types";
import { AlbumImage } from "@/components/ui";

const STALE_AFTER_SECONDS = 90;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getCurrentProgressMs(track: CurrentListening, now: number) {
  if (!track.duration_ms || track.duration_ms <= 0) {
    return 0;
  }

  const fetchedAtMs = new Date(track.fetched_at).getTime();
  const baseProgressMs = clamp(track.progress_ms ?? 0, 0, track.duration_ms);

  if (!track.is_playing || Number.isNaN(fetchedAtMs)) {
    return baseProgressMs;
  }

  const currentProgressMs = baseProgressMs + now - fetchedAtMs;

  return clamp(currentProgressMs, 0, track.duration_ms);
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function NowPlayingCard({ track }: { track: CurrentListening | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!track) {
      return;
    }

    setNow(Date.now());

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(intervalId);
  }, [track]);

  const hasTrack = Boolean(track?.track_id || track?.track_name);

  if (!track || !hasTrack) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-semibold text-white/70">Nothing playing</p>
        <p className="mt-1 text-sm text-white/40">
          No current track was detected on the latest refresh.
        </p>
      </section>
    );
  }

  const fetchedAtMs = new Date(track.fetched_at).getTime();
  const effectiveNow = now ?? (Number.isNaN(fetchedAtMs) ? 0 : fetchedAtMs);
  const staleSeconds = now === null || Number.isNaN(fetchedAtMs)
    ? null
    : Math.max(0, Math.round((now - fetchedAtMs) / 1000));
  const currentProgressMs = track ? getCurrentProgressMs(track, effectiveNow) : 0;
  const durationMs = track?.duration_ms ?? 0;
  const progress = durationMs > 0 ? (currentProgressMs / durationMs) * 100 : 0;
  const isStale = typeof staleSeconds === "number" && staleSeconds > STALE_AFTER_SECONDS;
  const isEffectivelyLive = Boolean(track?.is_playing && !isStale);

  return (
    <section className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-glow backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.075]">
      <div className="relative aspect-square overflow-hidden">
        <AlbumImage
          src={track.album_image_url}
          title={track.track_name}
          size={420}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs font-bold text-white/85 backdrop-blur">
          {isEffectivelyLive ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
            </span>
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
          )}
          {isEffectivelyLive ? "Live" : isStale ? "Last known" : "Paused"}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-black tracking-tight">
            {track.track_name}
          </h3>
          <p className="truncate text-sm font-medium text-white/65">
            {track.artist_names}
          </p>
          <p className="mt-1 truncate text-xs text-white/40">
            {track.album_name ?? "Single"}
          </p>
        </div>

        <div className="space-y-2">
          <div
            className="h-2 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label={`${track.track_name} playback progress`}
            aria-valuemin={0}
            aria-valuemax={durationMs}
            aria-valuenow={Math.round(currentProgressMs)}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400 shadow-[0_0_18px_rgba(103,232,249,0.45)] transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-white/50">
              {formatDuration(currentProgressMs)}
            </span>
            {isStale ? (
              <span className="truncate font-medium text-amber-200/80">
                last updated {staleSeconds} seconds ago
              </span>
            ) : now === null ? (
              <span className="text-white/40">Syncing...</span>
            ) : (
              <span className="text-white/40">Synced just now</span>
            )}
            <span className="font-medium text-white/50">
              {formatDuration(durationMs)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
