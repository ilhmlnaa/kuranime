import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WatchlistItem } from '../types'

interface WatchlistState {
  items: Record<string, WatchlistItem>
}

export type WatchlistInput = Pick<WatchlistItem, 'id' | 'slug' | 'title' | 'cover'> &
  Record<string, unknown>

interface WatchlistActions {
  add: (item: WatchlistInput) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
}

export type WatchlistStore = WatchlistState & WatchlistActions

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: {},
      add: (item) =>
        set((state) => ({
          items: {
            ...state.items,
            [item.id]: { ...item, addedAt: Date.now() },
          },
        })),
      remove: (id) =>
        set((state) => {
          const newItems = { ...state.items }
          delete newItems[id]
          return { items: newItems }
        }),
      clear: () => set({ items: {} }),
      has: (id) => id in get().items,
    }),
    {
      name: 'kuranime-watchlist',
      version: 1,
    },
  ),
)

export const selectWatchlistItems = (state: WatchlistStore) => state.items
export const selectAddToWatchlist = (state: WatchlistStore) => state.add
export const selectRemoveFromWatchlist = (state: WatchlistStore) => state.remove
export const selectClearWatchlist = (state: WatchlistStore) => state.clear
export const selectWatchlistHas = (id: string) => (state: WatchlistStore) =>
  state.items[id] !== undefined
export const selectWatchlistItem = (id: string) => (state: WatchlistStore) =>
  state.items[id]
