import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data. Silakan coba beberapa saat lagi.',
  onRetry,
  retryLabel = 'Coba Lagi',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      role="alert"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-red-500/10 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#181d2a] ring-1 ring-red-500/20">
          <AlertTriangle className="h-9 w-9 text-red-400" aria-hidden="true" />
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
      <p className="max-w-xs text-sm text-slate-400 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00a3ff] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00a3ff]/20 transition-all hover:bg-[#0090e0] hover:shadow-[#00a3ff]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] active:scale-95"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
};
