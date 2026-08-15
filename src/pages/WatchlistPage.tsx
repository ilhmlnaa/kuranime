import { Link } from 'react-router-dom';
import { BookmarkX, Trash2 } from 'lucide-react';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimeCard } from '../components/ui/AnimeCard';

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items);
  const removeFromWatchlist = useWatchlistStore((s) => s.remove);
  const clearWatchlist = useWatchlistStore((s) => s.clear);

  const list = Object.values(items);

  return (
    <div className="px-4 md:px-8 py-8 pb-16 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#00a3ff] rounded-full inline-block" />
          Watchlist
        </h1>
        {list.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Watchlist kosong"
          description="Anime yang kamu simpan akan muncul di sini."
          actionLabel="Jelajahi Anime"
          actionTo="/anime"
        />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
          {list.map((item) => (
            <div key={item.id} className="relative group">
              <AnimeCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                cover={item.cover}
                isBookmarked
                onBookmarkToggle={() => removeFromWatchlist(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { Link, BookmarkX };
