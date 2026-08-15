import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Link destination for "See All" button */
  actionHref?: string;
  to?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionHref,
  to,
  actionLabel = 'Lihat Semua',
  onActionClick,
  className = '',
}) => {
  const targetHref = to || actionHref;
  return (
    <div className={`flex items-end justify-between border-b border-white/[0.08] pb-3 mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[#00a3ff]" aria-hidden="true" />
          <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 pl-3">
            {subtitle}
          </p>
        )}
      </div>

      {(targetHref || onActionClick) && (
        <div className="flex-shrink-0">
          {targetHref ? (
            <Link
              to={targetHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#00a3ff] hover:text-[#00a3ff]/80 transition-colors focus-visible:outline-2 focus-visible:outline-[#00a3ff] rounded px-1 py-0.5"
            >
              <span>{actionLabel}</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#00a3ff] hover:text-[#00a3ff]/80 transition-colors focus-visible:outline-2 focus-visible:outline-[#00a3ff] rounded px-1 py-0.5"
            >
              <span>{actionLabel}</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
