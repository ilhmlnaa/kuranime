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
    <div className="pb-16 relative">
      {/* Top Breadcrumbs - Before Banner */}
      <div className="px-4 md:px-8 max-w-[1920px] mx-auto pt-4 pb-2 relative z-20">
        <Breadcrumbs
          items={[
            { label: 'Anime', to: '/anime' },
            { label: anime.title },
          ]}
          className="backdrop-blur-sm bg-black/20 p-2 rounded-xl inline-flex self-start border border-white/5"
        />
      </div>

      {/* Netflix-style Cinematic Banner Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[52vh] sm:h-[60vh] md:h-[70vh] min-h-[400px] w-full overflow-hidden pointer-events-none z-0">
        {/* Layer Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-[#070a10] via-[#070a10]/65 to-transparent z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-[#070a10]/90 via-[#070a10]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,#070a10_90%)] z-10" />

        {coverSrc && (
          <Image
            src={coverSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top opacity-65 md:opacity-75 scale-105 transition-transform duration-1000"
          />
        )}
      </div>

      <div className="px-4 md:px-8 max-w-[1920px] mx-auto pt-16 sm:pt-24 md:pt-36 relative z-20">
        <div className="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)] md:grid-cols-[220px_minmax(0,1fr)] gap-4 sm:gap-6 md:gap-8 items-start">
          
          {/* Left: Poster & Actions */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            <div className="rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/10 aspect-[3/4] relative bg-[#111620]">
              {coverSrc && (
                <Image src={coverSrc} alt={anime.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Desktop / Tablet Buttons (Under Poster) */}
            <div className="hidden sm:flex flex-col gap-2.5">
              {firstEpisode && (
                <Link
                  to={`/anime/${anime.id}/episode/${firstEpisode.episode}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-[#00a3ff] text-white hover:bg-[#00a3ff]/90 transition-all shadow-[0_0_20px_rgba(0,163,255,0.3)] text-sm active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Nonton Ep 1
                </Link>
              )}

              <button
                onClick={handleWatchlistToggle}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold transition-all text-xs border ${
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
                {isInWatchlist ? 'Tersimpan' : 'Simpan Anime'}
              </button>
            </div>
          </div>

          {/* Right: Info & Metadata */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl md:text-4xl font-bold text-white leading-tight">
              {anime.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              {status && (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#00a3ff]/15 text-[#00a3ff] rounded-full border border-[#00a3ff]/30 font-semibold text-[11px] sm:text-xs">
                  {status}
                </span>
              )}
              {rating && (
                <div className="flex items-center gap-1 text-slate-400 bg-white/5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/5">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-xs text-slate-200">{rating}</span>
                </div>
              )}
            </div>

            {genresList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {genresList.map((g, i) => {
                  const name = typeof g === 'string' ? g.replace(/,$/, '') : g.name.replace(/,$/, '');
                  return (
                    <span key={i} className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#121620] border border-white/10 rounded-lg text-[11px] sm:text-xs text-slate-400 font-medium">
                      {name}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Mobile Actions (Under Title/Genres for compact screen) */}
            <div className="flex sm:hidden items-center gap-2 pt-1">
              {firstEpisode && (
                <Link
                  to={`/anime/${anime.id}/episode/${firstEpisode.episode}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold bg-[#00a3ff] text-white text-xs shadow-[0_0_12px_rgba(0,163,255,0.3)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Nonton Ep 1
                </Link>
              )}
              <button
                onClick={handleWatchlistToggle}
                className={`p-2.5 rounded-xl font-semibold transition-all text-xs border ${
                  isInWatchlist
                    ? 'bg-[#121620] border-[#00a3ff]/40 text-[#00a3ff]'
                    : 'bg-[#121620] border-white/10 text-slate-300'
                }`}
                title={isInWatchlist ? 'Tersimpan' : 'Simpan Anime'}
              >
                {isInWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              </button>
            </div>

            {/* Synopsis - Desktop & Tablet Inline */}
            {anime.synopsis && (
              <div className="hidden sm:block mt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Info className="w-4 h-4 text-[#00a3ff]" />
                  <h3 className="font-semibold text-slate-200 text-xs sm:text-sm">Sinopsis</h3>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm line-clamp-6 whitespace-pre-wrap">
                  {anime.synopsis as string}
                </p>
              </div>
            )}

            {/* Info Grid - Desktop & Tablet Inline */}
            {anime.info && typeof anime.info === 'object' && !Array.isArray(anime.info) && (
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
                {Object.entries(anime.info as Record<string, unknown>).slice(0, 6).map(([key, val]) => (
                  <div key={key} className="bg-[#121620]/80 backdrop-blur-sm border border-white/5 rounded-xl p-2.5">
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                      {key}
                    </div>
                    <div className="text-slate-300 text-xs font-medium leading-snug truncate">
                      {String(val ?? '-').replace(/\s+/g, ' ').trim()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Full-width Synopsis & Info Grid (below top split) */}
        <div className="flex flex-col gap-4 mt-6 sm:hidden">
          {anime.synopsis && (
            <div className="bg-[#111620]/60 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#00a3ff]" />
                <h3 className="font-semibold text-slate-200 text-xs">Sinopsis</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs line-clamp-6 whitespace-pre-wrap">
                {anime.synopsis as string}
              </p>
            </div>
          )}

          {anime.info && typeof anime.info === 'object' && !Array.isArray(anime.info) && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(anime.info as Record<string, unknown>).slice(0, 6).map(([key, val]) => (
                <div key={key} className="bg-[#111620]/60 border border-white/5 rounded-xl p-2.5">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                    {key}
                  </div>
                  <div className="text-slate-300 text-xs font-medium leading-snug truncate">
                    {String(val ?? '-').replace(/\s+/g, ' ').trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
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
