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
          className="flex flex-col overflow-hidden rounded-xl bg-[#181d2a] ring-1 ring-white/[0.04] animate-pulse"
        >
          {/* Card Poster Aspect Ratio */}
          <div className="aspect-[3/4] w-full bg-slate-800" />

          {/* Card Info */}
          <div className="p-3 space-y-2">
            <div className="h-4 w-4/5 rounded bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
};
