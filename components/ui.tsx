import Image from "next/image";

function normalizeImageSrc(src: string | null) {
  const normalizedSrc = src?.trim().replace(/^=+/, "");

  if (!normalizedSrc) {
    return null;
  }

  if (normalizedSrc.startsWith("/")) {
    return normalizedSrc;
  }

  try {
    const url = new URL(normalizedSrc);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function safeInitial(value: string | null | undefined, fallback = "?") {
  return (value?.trim().slice(0, 1) || fallback).toUpperCase();
}

export function RelativeTime({ value }: { value: string }) {
  return <>{formatRelativeTime(value)}</>;
}

export function formatClockTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--:--";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

export function formatRelativeTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const seconds = Math.max(1, Math.round((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.round(hours / 24)}d ago`;
}

export function secondsSince(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
}

export function Avatar({
  src,
  name,
  size = 40
}: {
  src: string | null;
  name: string | null | undefined;
  size?: number;
}) {
  const displayName = name?.trim() || "Unknown listener";
  const imageSrc = normalizeImageSrc(src);

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={`${displayName} avatar`}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-white/10"
      />
    );
  }

  return (
    <div
      className="grid place-items-center rounded-full bg-blue-500/15 font-bold text-cyan-100 ring-2 ring-white/10"
      style={{ width: size, height: size }}
    >
      {safeInitial(displayName)}
    </div>
  );
}

export function AlbumImage({
  src,
  title,
  className,
  size = 96
}: {
  src: string | null;
  title: string | null | undefined;
  className?: string;
  size?: number;
}) {
  const imageTitle = title?.trim() || "Untitled track";
  const imageSrc = normalizeImageSrc(src);

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={`${imageTitle} album art`}
        width={size}
        height={size}
        className={className}
      />
    );
  }

  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-cyan-300/35 via-violet-300/15 to-white/5 font-black text-white/65 ${className}`}
    >
      {safeInitial(imageTitle)}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.035] p-4 text-sm text-white/50">
      {message}
    </div>
  );
}
