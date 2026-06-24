import type { RecentListening } from "@/lib/types";
import { AlbumImage, EmptyState, RelativeTime } from "@/components/ui";

export function RecentTracksList({ tracks }: { tracks: RecentListening[] }) {
  const visibleTracks = tracks.slice(0, 10);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
      <div className="mb-3">
        <h3 className="text-lg font-bold">Last 10 Tracks</h3>
        <p className="text-xs text-white/45">Fresh plays from this listener</p>
      </div>

      {visibleTracks.length > 0 ? (
        <ol className="space-y-1">
          {visibleTracks.map((track) => (
            <li
              key={track.id}
              className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl px-1 py-2 transition hover:bg-white/[0.07]"
            >
              <AlbumImage
                src={track.album_image_url}
                title={track.track_name}
                size={72}
                className="h-11 w-11 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{track.track_name}</p>
                <p className="truncate text-xs text-white/50">{track.artist_names}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-white/35">
                <RelativeTime value={track.played_at} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState message="No recent plays yet." />
      )}
    </section>
  );
}
