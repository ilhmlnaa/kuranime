import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Bookmark, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlistStore } from '../../store/useWatchlistStore';

export function AppHeader() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const watchlistCount = useWatchlistStore((s) => Object.keys(s.items).length);

  // Auto-hide header on scroll down, reveal on scroll up
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScrollY.current;
      if (current < 60) {
        setVisible(true);
      } else if (diff > 6) {
        setVisible(false);
      } else if (diff < -6) {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus, Escape to blur
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if (e.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/anime?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  }, [query, navigate]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <motion.header
      className="sticky top-0 z-20 hidden md:block"
      initial={false}
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex h-16 items-center gap-4 border-b border-[#00a3ff]/20 bg-gradient-to-r from-[#070a10] via-[#091120] to-[#070a10] px-6 backdrop-blur-md shadow-[0_4px_20px_rgba(0,163,255,0.05)]">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className={`relative flex items-center transition-all duration-200 ${focused ? 'ring-1 ring-[#00a3ff]/50' : ''} rounded-xl overflow-hidden bg-[#111827] border border-white/[0.07] hover:border-[#00a3ff]/25`}>
            <Search className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Cari anime... (Ctrl+K)"
              className="w-full bg-transparent py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-500 outline-none"
              autoComplete="off"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-3 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Right quick-access buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <HeaderIconBtn
            label="Watchlist"
            icon={<Bookmark className="h-4.5 w-4.5" />}
            badge={watchlistCount > 0 ? watchlistCount : undefined}
            onClick={() => navigate('/watchlist')}
          />
          <HeaderIconBtn
            label="History"
            icon={<History className="h-4.5 w-4.5" />}
            onClick={() => navigate('/history')}
          />
        </div>
      </div>
    </motion.header>
  );
}

function HeaderIconBtn({
  label,
  icon,
  badge,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-[#00a3ff]/10 hover:text-[#00a3ff] focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00a3ff] px-1 text-[10px] font-bold text-white leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
