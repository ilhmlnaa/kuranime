export type FlexibleRecord = Record<string, unknown>

export interface ApiEnvelope<T> extends FlexibleRecord {
  data?: T
  success?: boolean
  message?: string
}

export interface AnimeBase extends FlexibleRecord {
  title: string
  url?: string
  slug: string
}

export interface RecentAnime extends AnimeBase {
  episode: string | number
  quality?: string
  img: string
}

export interface CarouselAnime extends AnimeBase {
  img: string
}

export interface HomeData extends FlexibleRecord {
  recent: RecentAnime[]
  carousel: CarouselAnime[]
}

export interface AnimeListItem extends AnimeBase {
  id: string
}

export interface AnimeListData extends FlexibleRecord {
  results: AnimeListItem[]
  pagination?: FlexibleRecord
}

export interface EpisodeSummary extends FlexibleRecord {
  episode: string | number
  title?: string
  url?: string
  slug?: string
}

export interface Server extends FlexibleRecord {
  name?: string
  title?: string
  url?: string
  id?: string
}

export interface AnimeDetail extends FlexibleRecord {
  id: string
  slug: string
  title: string
  rating?: string | number
  status?: string
  cover?: string
  synopsis?: string
  genres?: Array<string | FlexibleRecord>
  info?: FlexibleRecord | Array<FlexibleRecord>
  episodes?: EpisodeSummary[]
  batch?: unknown
}

export interface DownloadLink extends FlexibleRecord {
  name: string
  url: string
}

export interface DownloadQuality extends FlexibleRecord {
  quality: string
  size: string
  links: DownloadLink[]
}

export interface EpisodeNavigation extends FlexibleRecord {
  previous?: unknown
  next?: unknown
}

export interface EpisodeData extends FlexibleRecord {
  animeId: string
  episode: string | number
  title: string
  animeTitle: string
  servers?: Server[]
  downloads?: DownloadQuality[]
  streamUrl?: string
  navigation?: EpisodeNavigation
}

export interface StreamData extends FlexibleRecord {
  videoUrl?: string
  iframeUrl?: string
  servers?: Server[]
}

export interface ScheduleItem extends FlexibleRecord {
  title: string
  episode: string | number
  airDay: string
  airTime: string
  img: string
  url?: string
  id: string
}

export interface ScheduleDay extends FlexibleRecord {
  day: string
  schedule: ScheduleItem[]
}

export type ScheduleData = ScheduleDay | ScheduleDay[]

export interface WatchlistItem extends FlexibleRecord {
  id: string
  slug: string
  title: string
  cover?: string
  addedAt: number
}

export interface HistoryItem extends FlexibleRecord {
  animeId: string
  slug: string
  title: string
  animeTitle: string
  episode: string | number
  cover?: string
  watchedAt: number
  progress?: number
}
