import { useParams, Link } from 'react-router-dom';
import { Play, BookmarkPlus, BookmarkCheck, Star, Info } from 'lucide-react';
import { useAnimeDetail } from '../hooks/useAnime';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { AnimeDetailSkeleton } from '../components/ui/skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Image } from '../components/ui/Image';

export default function AnimeDetailPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const { data: anime, isLoading, error, refetch } = useAnimeDetail(id, slug);

  const items = useWatchlistStore((s) => s.items);
  const addToWatchlist = useWatchlistStore((s) => s.add);
  const removeFromWatchlist = useWatchlistStore((s) => s.remove);

  if (isLoading) return <AnimeDetailSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!anime) return <ErrorState message="Anime tidak ditemukan" />;

  const isInWatchlist = Boolean(items[anime.id]);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(anime.id);
    } else {
      addToWatchlist({
        id: anime.id,
        slug: anime.slug,
        title: anime.title,
        cover: anime.cover,
      });
    }
  };

  const coverSrc = anime.cover as string | undefined;
  const genresList = (anime.genres ?? []) as Array<{ name: string } | string>;
  const episodesList = (anime.episodes ?? []) as Array<{ episode: number; title?: string; url?: string }>;
  const rating = anime.rating as string | undefined;
  const status = anime.status as string | undefined;

  const firstEpisode = episodesList.length > 0 ? episodesList[episodesList.length - 1] : undefined;

  return (
    <div className="pb-16">
      {/* Banner */}
      <div className="relative w-full h-[38vh] md:h-[48vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-[#0b0e14]/40 to-transparent z-10" />
        {coverSrc && (
          <Image
            src={coverSrc}
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto -mt-32 relative z-20">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Anime', to: '/anime' },
            { label: anime.title },
          ]}
          className="mb-5 mt-2"
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-[180px] md:w-[220px] flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[3/4]">
              {coverSrc && (
                <Image src={coverSrc} alt={anime.title} className="w-full h-full object-cover" />
              )}
            </div>

            {firstEpisode && (
              <Link
                to={`/anime/${anime.id}/episode/${firstEpisode.episode}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold bg-[#00a3ff] text-white hover:bg-[#00a3ff]/90 transition-colors shadow-[0_0_16px_rgba(0,163,255,0.3)] text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Nonton Sekarang
              </Link>
            )}

            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-colors text-sm border ${
                isInWatchlist
                  ? 'bg-[#121620] border-[#00a3ff]/40 text-[#00a3ff] hover:bg-[#00a3ff]/10'
                  : 'bg-[#121620] border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              {isInWatchlist ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <BookmarkPlus className="w-4 h-4" />
              )}
              {isInWatchlist ? 'Tersimpan' : 'Simpan'}
            </button>
          </div>

          {/* Info */}
          <div className="flex-grow flex flex-col gap-4 md:pt-14">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{anime.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {status && (
                <span className="px-3 py-1 bg-[#00a3ff]/15 text-[#00a3ff] rounded-full border border-[#00a3ff]/30 font-medium text-xs">
                  {status}
                </span>
              )}
              {rating && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-medium">{rating}</span>
                </div>
              )}
            </div>

            {genresList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genresList.map((g, i) => {
                  const name = typeof g === 'string' ? g.replace(/,$/, '') : g.name.replace(/,$/, '');
                  return (
                    <span key={i} className="px-2.5 py-1 bg-[#121620] border border-white/10 rounded-lg text-xs text-slate-400">
                      {name}
                    </span>
                  );
                })}
              </div>
            )}

            {anime.synopsis && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#00a3ff]" />
                  <h3 className="font-semibold text-slate-200 text-sm">Sinopsis</h3>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm line-clamp-6 whitespace-pre-wrap">
                  {anime.synopsis as string}
                </p>
              </div>
            )}

            {/* Info Grid */}
            {anime.info && typeof anime.info === 'object' && !Array.isArray(anime.info) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {Object.entries(anime.info as Record<string, unknown>).slice(0, 9).map(([key, val]) => (
                  <div key={key} className="bg-[#121620] border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                      {key}
                    </div>
                    <div className="text-slate-300 text-sm font-medium leading-snug">
                      {String(val ?? '-').replace(/\s+/g, ' ').trim().slice(0, 60)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Episode List */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#00a3ff] rounded-full inline-block" />
              Daftar Episode
            </h2>
            <span className="text-slate-500 text-sm">{episodesList.length} episode</span>
          </div>

          {episodesList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {[...episodesList].sort((a, b) => Number(a.episode) - Number(b.episode)).map((ep) => (
                <Link
                  key={ep.episode}
                  to={`/anime/${anime.id}/episode/${ep.episode}`}
                  className="flex flex-col items-center justify-center gap-1 bg-[#121620] hover:bg-[#00a3ff]/10 border border-white/10 hover:border-[#00a3ff]/40 p-3 rounded-xl transition-all group text-center"
                >
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-[#00a3ff] transition-colors" />
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                    Ep {ep.episode}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-[#121620] border border-white/10 rounded-2xl text-slate-500">
              Belum ada episode yang tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
