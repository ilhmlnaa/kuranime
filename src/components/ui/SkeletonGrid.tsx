import React from 'react';

export interface SkeletonGridProps {
  /** Number of skeleton cards to render */
  count?: number;
  /** Layout type */
  variant?: 'card' | 'row';
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 12,
  variant = 'card',
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (variant === 'row') {
    return (
      <div className={`space-y-3 ${className}`} aria-busy="true" aria-label="Loading list">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl bg-[#181d2a] p-3 ring-1 ring-white/[0.04] animate-pulse"
          >
            {/* Poster Skeleton */}
            <div className="h-16 w-12 flex-shrink-0 rounded-lg bg-slate-800" />

            {/* Body Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/5 rounded bg-slate-800" />
              <div className="h-3 w-2/5 rounded bg-slate-800/60" />
            </div>

            {/* Action Skeleton */}
            <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
      aria-busy="true"
      aria-label="Loading anime items"
    >
      {items.map((_, i) => (
        <div
          key={i}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#0d1117] ring-1 ring-white/[0.04] animate-pulse"
        >
          {/* Subtle gradient to mimic the card's scrim */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
          
          {/* Dummy text lines at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-3 space-y-2">
            <div className="h-3.5 w-4/5 rounded bg-slate-700/50" />
            <div className="h-2.5 w-2/5 rounded bg-slate-800/80" />
          </div>
        </div>
      ))}
    </div>
  );
};
