import { Link } from 'react-router-dom';
import { Play, Trash2, Clock } from 'lucide-react';
import { useHistoryStore } from '../store/useHistoryStore';
import { EmptyState } from '../components/ui/EmptyState';
import { Image } from '../components/ui/Image';

export default function HistoryPage() {
  const items = useHistoryStore((s) => s.items);
  const removeItem = useHistoryStore((s) => s.remove);
  const clearHistory = useHistoryStore((s) => s.clear);

  const list = Object.values(items).sort((a, b) => b.watchedAt - a.watchedAt);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="px-4 md:px-8 py-8 pb-16 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 bg-gradient-to-b from-[#38bdf8] to-[#0284c7] rounded-full inline-block" />
          Riwayat Tontonan
        </h1>
        {list.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Anime yang kamu tonton akan tercatat di sini."
          actionLabel="Mulai Nonton"
          actionTo="/"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <div key={item.animeId} className="flex items-center gap-4 bg-[#121620] hover:bg-[#1e2635] border border-white/10 rounded-2xl p-3.5 transition-colors group">
              {/* Poster */}
              <div className="flex-shrink-0 w-12 h-16 md:w-14 md:h-20 rounded-xl overflow-hidden bg-[#0b0e14] border border-white/10">
                {item.cover && (
                  <Image src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <Link
                  to={`/anime/${item.animeId}/${item.slug}`}
                  className="text-slate-200 font-semibold text-sm md:text-base line-clamp-1 group-hover:text-[#00a3ff] transition-colors"
                >
                  {item.title}
                </Link>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[#38bdf8] text-xs font-medium">
                    <Play className="w-3 h-3 fill-current" />
                    Episode {item.episode}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.watchedAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/anime/${item.animeId}/episode/${item.episode}`}
                  className="p-2 rounded-xl bg-[#00a3ff]/10 hover:bg-[#00a3ff]/20 text-[#00a3ff] transition-colors"
                  title="Lanjut Nonton"
                >
                  <Play className="w-4 h-4 fill-current" />
                </Link>
                <button
                  onClick={() => removeItem(item.animeId)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"
                  title="Hapus dari riwayat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
