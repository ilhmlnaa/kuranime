import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryItem } from '../types'

interface HistoryState {
  items: Record<string, HistoryItem>
}

export type HistoryInput = Pick<
  HistoryItem,
  'animeId' | 'slug' | 'title' | 'animeTitle' | 'episode' | 'cover' | 'progress'
> & Record<string, unknown>

interface HistoryActions {
  add: (item: HistoryInput) => void
  remove: (animeId: string) => void
  clear: () => void
  get: (animeId: string) => HistoryItem | undefined
}

export type HistoryStore = HistoryState & HistoryActions

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      items: {},
      add: (item) =>
        set((state) => ({
          items: {
            ...state.items,
            [item.animeId]: { ...item, watchedAt: Date.now() },
          },
        })),
      remove: (animeId) =>
        set((state) => {
          const newItems = { ...state.items }
          delete newItems[animeId]
          return { items: newItems }
        }),
      clear: () => set({ items: {} }),
      get: (animeId) => get().items[animeId],
    }),
    {
      name: 'kuranime-history',
      version: 1,
    },
  ),
)

export const selectHistoryItems = (state: HistoryStore) => state.items
export const selectAddHistory = (state: HistoryStore) => state.add
export const selectRemoveHistory = (state: HistoryStore) => state.remove
export const selectClearHistory = (state: HistoryStore) => state.clear
export const selectHistoryItem = (animeId: string) => (state: HistoryStore) =>
  state.items[animeId]
