import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Play, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Image } from './Image';

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

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, e);
  };

  const containerClasses = `group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#0d1117] ring-1 ring-white/[0.08] transition-all duration-300 hover:ring-[#00a3ff]/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:shadow-[#00a3ff]/10 focus-within:ring-2 focus-within:ring-[#00a3ff] ${className}`;

  const Content = (
    <>
      {/* Background Poster Image */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`Poster ${title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#111827] text-slate-600">
          <PlayCircle className="h-10 w-10 mb-2 opacity-30" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">No Poster</span>
        </div>
      )}

      {/* Modern Vignette & Bottom Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a10]/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-70" />

      {/* Hover Central Play Button (Aesthetic & Light) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00a3ff] text-white shadow-lg shadow-[#00a3ff]/40 transform scale-90 transition-transform duration-300 group-hover:scale-100">
          <Play className="h-5 w-5 fill-current translate-x-0.5" />
        </div>
      </div>

      {/* Top Badges (Rating, EP & Bookmark) */}
      <div className="absolute left-2.5 right-2.5 top-2.5 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {epDisplay && (
            <span className="inline-flex items-center rounded-md bg-[#00a3ff] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md leading-tight">
              EP {epDisplay}
            </span>
          )}
          {rating && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-400 backdrop-blur-xs leading-tight">
              <Star className="h-2.5 w-2.5 fill-current" />
              {rating}
            </span>
          )}
        </div>

        {onBookmarkToggle && (
          <button
            type="button"
            onClick={handleBookmark}
            className={`pointer-events-auto flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-xs transition-all active:scale-95 ${
              isBookmarked
                ? 'bg-[#00a3ff] text-white shadow-md shadow-[#00a3ff]/30'
                : 'bg-black/50 text-white/70 hover:bg-black/80 hover:text-white'
            }`}
            aria-label={isBookmarked ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
          >
            <motion.div
              initial={false}
              animate={{ scale: isBookmarked ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.div>
          </button>
        )}
      </div>

      {/* Bottom Title & Metadata Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10 flex flex-col justify-end transform transition-transform duration-300 group-hover:-translate-y-0.5">
        <h3 className="line-clamp-2 text-xs md:text-sm font-semibold leading-tight text-white drop-shadow-md transition-colors group-hover:text-[#00a3ff]">
          {title}
        </h3>

        {(year || genres.length > 0) && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            {year && <span>{year}</span>}
            {year && genres.length > 0 && <span className="h-0.5 w-0.5 rounded-full bg-slate-500" />}
            {genres.length > 0 && <span className="truncate">{genres[0]}</span>}
          </div>
        )}
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
