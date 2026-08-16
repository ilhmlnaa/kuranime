import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, PlayCircle, Clock } from 'lucide-react';

export interface AnimeRowProps {
  id: string | number;
  title: string;
  posterUrl?: string;
  /** e.g. "Episode 5" or "5/12" */
  episodeInfo?: string;
  /** e.g. "Watched 2 hours ago" */
  subtext?: string;
  /** Progress (0–100) for a horizontal progress bar */
  progress?: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string | number, e: React.MouseEvent) => void;
  /** Navigation target */
  to?: string;
  className?: string;
}

export const AnimeRow: React.FC<AnimeRowProps> = ({
  id,
  title,
  posterUrl,
  episodeInfo,
  subtext,
  progress,
  isBookmarked = false,
  onBookmarkToggle,
  to,
  className = '',
}) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(id, e);
  };

  const content = (
    <div className={`group flex items-center gap-4 rounded-xl bg-[#181d2a] px-4 py-3 ring-1 ring-white/[0.04] transition-all hover:bg-[#212738] hover:ring-white/[0.08] focus-within:ring-2 focus-within:ring-[#00a3ff] ${className}`}>
      {/* Poster */}
      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800 shadow-inner">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-600">
            <PlayCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-100 group-hover:text-[#00a3ff] transition-colors">
          {title}
        </h3>

        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
          {episodeInfo && (
            <span className="inline-flex items-center gap-1 font-medium text-[#00a3ff]/90">
              <PlayCircle className="h-3 w-3" aria-hidden="true" />
              {episodeInfo}
            </span>
          )}
          {subtext && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-50" aria-hidden="true" />
              {subtext}
            </span>
          )}
        </div>

        {/* Progress */}
        {progress !== undefined && (
          <div className="mt-2 h-1 w-full rounded-full bg-slate-700 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-linear-to-r from-[#00a3ff] to-[#38bdf8] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>

      {/* Bookmark */}
      {onBookmarkToggle && (
        <button
          type="button"
          onClick={handleBookmark}
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all active:scale-95 ${
            isBookmarked
              ? 'bg-[#00a3ff]/20 text-[#00a3ff] hover:bg-[#00a3ff]/30'
              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          }`}
          aria-label={isBookmarked ? `Remove ${title} from Watchlist` : `Add ${title} to Watchlist`}
        >
          <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="block focus-visible:outline-none">{content}</Link>;
  }

  return content;
};
