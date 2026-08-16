import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { Brand } from './Brand';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { DEFAULT_NAV_ITEMS } from './navItems';
import type { NavItem } from './navItems';

export type { NavItem } from './navItems';

export interface AppShellProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  headerRightSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  navItems = DEFAULT_NAV_ITEMS,
  headerRightSlot,
  sidebarFooterSlot,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const drawerVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: shouldReduceMotion ? ('tween' as const) : ('spring' as const),
        duration: shouldReduceMotion ? 0.1 : 0.3,
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: shouldReduceMotion ? ('tween' as const) : ('spring' as const),
        duration: shouldReduceMotion ? 0.1 : 0.3,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <div className={`min-h-screen bg-[#070a10] text-slate-100 antialiased relative ${className}`}>
      
      {/* Global Background Texture (Matrix Grid + Glow) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Soft Grid Lines across the whole page */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Dot pattern accent in cyan */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,163,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] bg-[position:-16px_-16px]" />
        
        {/* Vertical subtle gradient mask to make it slightly fade at the very bottom, but still visible */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#070a10]/50 to-[#070a10]/90" />
        
        {/* Ambient Top Cyan Glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] max-w-[1500px] h-[50vh] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(0,163,255,0.06)_0%,transparent_100%)] blur-3xl opacity-60" />
      </div>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#00a3ff]/20 bg-linear-to-r from-[#0d1117] via-[#091120] to-[#0b0e14] px-4 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,163,255,0.06)] md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-[#00a3ff]/10 hover:text-[#00a3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a3ff] active:scale-95"
          aria-label="Open Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>

        <Brand size="sm" />

        <div className="flex items-center min-w-11 justify-end">
          {headerRightSlot || (
            <Link
              to="/anime"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] border border-[#00a3ff]/15 text-slate-300 transition-colors hover:bg-[#00a3ff]/10 hover:text-[#00a3ff] focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
              aria-label="Cari Anime"
            >
              <Search className="h-4 w-4 text-[#00a3ff]" />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer (Animated) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            />

            {/* Sidebar Content */}
            <motion.aside
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 bottom-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-[#00a3ff]/10 bg-linear-to-b from-[#0d1117] to-[#080b12] p-5 shadow-2xl shadow-black/80"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#00a3ff]/10">
                <Brand size="md" />
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#00a3ff]/10 hover:text-[#00a3ff] focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Drawer Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('mobileSearch') as HTMLInputElement;
                  if (input?.value.trim()) {
                    closeMobileMenu();
                    navigate(`/anime?q=${encodeURIComponent(input.value.trim())}`);
                  }
                }}
                className="pt-4"
              >
                <div className="relative flex items-center rounded-xl bg-[#111827] border border-white/[0.07]">
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    name="mobileSearch"
                    type="text"
                    placeholder="Cari anime..."
                    className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none"
                  />
                </div>
              </form>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto pt-4 pb-2 space-y-1.5" aria-label="Mobile Navigation Links">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === '/'}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#00a3ff] ${
                          isActive
                            ? 'bg-linear-to-r from-[#00a3ff]/15 to-transparent text-[#00a3ff] font-semibold border-l-2 border-[#00a3ff]'
                            : 'text-slate-400 hover:bg-[#00a3ff]/5 hover:text-slate-200'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3.5">
                            <Icon
                              className={`h-5 w-5 transition-colors ${
                                isActive ? 'text-[#00a3ff]' : 'text-slate-400 group-hover:text-slate-200'
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="rounded-full bg-[#111827] px-2 py-0.5 text-xs text-slate-300 border border-[#00a3ff]/15 font-normal">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              {sidebarFooterSlot && (
                <div className="pt-4 border-t border-[#00a3ff]/10">
                  {sidebarFooterSlot}
                </div>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#00a3ff]/10 bg-linear-to-b from-[#0d1117] via-[#090c13] to-[#07090f] md:flex">
        {/* Brand Container */}
        <div className="flex h-16 items-center px-6 border-b border-[#00a3ff]/10">
          <Brand size="md" />
        </div>

        {/* Desktop Nav Items */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5" aria-label="Desktop Navigation Links">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#00a3ff] ${
                      isActive
                        ? 'bg-linear-to-r from-[#00a3ff]/15 via-[#00a3ff]/5 to-transparent text-[#00a3ff] font-semibold'
                        : 'text-slate-400 hover:bg-[#00a3ff]/5 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4.5 w-4.5 transition-colors ${
                            isActive ? 'text-[#00a3ff]' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {/* Active indicator bar with glow */}
                      {isActive && (
                        <motion.div
                          layoutId={shouldReduceMotion ? undefined : 'activeIndicator'}
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00a3ff] shadow-[0_0_8px_rgba(0,163,255,0.7)]"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      {item.badge !== undefined && (
                        <span className="rounded-full bg-[#111827] px-2 py-0.5 text-xs text-slate-300 border border-[#00a3ff]/15 font-normal">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Sidebar Footer */}
          {sidebarFooterSlot && (
            <div className="pt-6 border-t border-[#00a3ff]/10">
              {sidebarFooterSlot}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-screen flex-col md:pl-64">
        {/* Desktop Auto-Hide Header with Search */}
        <AppHeader />

        {/* Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
};
