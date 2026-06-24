import type { RepeatStat } from "@/lib/types";
import { AlbumImage, EmptyState } from "@/components/ui";

export function RepeatSongsCard({ songs }: { songs: RepeatStat[] }) {
  const visibleSongs = songs.slice(0, 8);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
      <div className="mb-3">
        <h3 className="text-lg font-bold">On Repeat</h3>
        <p className="text-xs text-white/45">Top songs from the last 7 days</p>
      </div>

      {visibleSongs.length > 0 ? (
        <ol className="space-y-2">
          {visibleSongs.map((song, index) => (
            <li
              key={`${song.user_id}-${song.track_id}`}
              className="grid grid-cols-[30px_44px_1fr_auto] items-center gap-3 rounded-2xl bg-white/[0.04] p-2 ring-1 ring-white/10 transition hover:bg-white/[0.07]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-300/15 text-xs font-black text-violet-100">
                {index + 1}
              </span>
              <AlbumImage
                src={song.album_image_url}
                title={song.track_name}
                size={72}
                className="h-11 w-11 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{song.track_name}</p>
                <p className="truncate text-xs text-white/50">{song.artist_names}</p>
              </div>
              <span className="rounded-full bg-cyan-300/15 px-2.5 py-1 text-xs font-black text-cyan-100">
                {song.plays_last_7_days}x
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState message="No repeats this week yet." />
      )}
    </section>
  );
}
