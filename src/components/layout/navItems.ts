import React from 'react';
import {
  Home,
  Film,
  Calendar,
  Bookmark,
  History,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Anime List', href: '/anime', icon: Film },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
  { name: 'History', href: '/history', icon: History },
];
