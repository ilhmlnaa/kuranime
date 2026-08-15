import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, ArrowRight } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Data',
  message,
  description,
  icon: Icon = Inbox,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) => {
  const text = description || message || 'Konten yang Anda cari belum tersedia.';
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="relative mb-6">
        {/* Subtle Purple Accent */}
        <div className="absolute -inset-4 rounded-full bg-[#00a3ff]/5 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#181d2a] ring-1 ring-white/[0.06]">
          <Icon className="h-9 w-9 text-slate-500" aria-hidden="true" />
          <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-[#00a3ff] ring-2 ring-[#181d2a]" />
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
      <p className="max-w-xs text-sm text-slate-400 leading-relaxed">{text}</p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/[0.08] transition-all hover:bg-slate-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] active:scale-95"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/[0.08] transition-all hover:bg-slate-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] active:scale-95"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
