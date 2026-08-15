import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Whether to show the search bar */
  searchable?: boolean;
  /** Current search value */
  searchValue?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** Slot for additional actions (buttons, filters, etc.) */
  actionsSlot?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  searchable = false,
  searchValue = '',
  searchPlaceholder = 'Cari anime…',
  onSearchChange,
  actionsSlot,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Title Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-400 max-w-xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actionsSlot && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actionsSlot}
          </div>
        )}
      </div>

      {/* Search Bar */}
      {searchable && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative max-w-md"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#181d2a] pl-11 pr-11 text-sm text-slate-200 placeholder:text-slate-500 transition-all hover:border-white/[0.14] focus:border-[#00a3ff]/70 focus:outline-none focus:ring-2 focus:ring-[#00a3ff]/20"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
