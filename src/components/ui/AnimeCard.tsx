import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AnimeCardProps {
  id: string | number;
  title: string;
  posterUrl?: string;
  cover?: string;
  slug?: string;
  rating?: number | string;
  episode?: number | string;
  badge?: number | string;
  year?: number | string;
  genres?: string[];
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string | number, e: React.MouseEvent) => void;
  className?: string;
  /** Pass 'href' to wrap in an a-tag (external) or 'to' for React Router Link */
  href?: string;
  to?: string;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  posterUrl,
  cover,
  slug,
  rating,
  episode,
  badge,
  year,
  genres = [],
  isBookmarked = false,
  onBookmarkToggle,
  className = '',
  href,
  to,
}) => {
  const imageSrc = posterUrl || cover;
  const epDisplay = episode || badge;
  const targetUrl = to || (id ? (slug ? `/anime/${id}/${slug}` : `/anime/${id}`) : undefined);
  const containerClasses = `group relative flex flex-col rounded-xl bg-[#181d2a] ring-1 ring-white/[0.04] transition-all hover:bg-[#212738] hover:shadow-xl hover:shadow-[#0b0e14]/50 focus-within:ring-2 focus-within:ring-[#00a3ff] overflow-hidden ${className}`;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, e);
  };

  const Content = (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Poster for ${title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-800 text-slate-500">
            <PlayCircle className="h-10 w-10 mb-2 opacity-30" />
            <span className="text-xs uppercase tracking-wider font-semibold">No Image</span>
          </div>
        )}

        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/90 via-[#0b0e14]/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {rating && (
              <span className="inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-yellow-500 backdrop-blur-md">
                <Star className="h-3 w-3 fill-current" />
                {rating}
              </span>
            )}
            {epDisplay && (
              <span className="inline-flex items-center rounded bg-[#00a3ff]/80 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
                EP {epDisplay}
              </span>
            )}
          </div>

          {onBookmarkToggle && (
            <button
              type="button"
              onClick={handleBookmark}
              className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-all active:scale-95 ${
                isBookmarked
                  ? 'bg-[#00a3ff]/90 text-white shadow-lg shadow-[#00a3ff]/20'
                  : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
              }`}
              aria-label={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <motion.div
                initial={false}
                animate={{ scale: isBookmarked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100 transition-colors group-hover:text-[#00a3ff]">
            {title}
          </h3>
          
          {(year || genres.length > 0) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
              {year && <span>{year}</span>}
              {year && genres.length > 0 && <span className="h-1 w-1 rounded-full bg-slate-600" />}
              {genres.length > 0 && (
                <span className="truncate">{genres[0]}{genres.length > 1 ? ` +${genres.length - 1}` : ''}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (targetUrl) {
    return (
      <Link to={targetUrl} className={containerClasses}>
        {Content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={containerClasses}>
        {Content}
      </a>
    );
  }

  return <div className={containerClasses}>{Content}</div>;
};
