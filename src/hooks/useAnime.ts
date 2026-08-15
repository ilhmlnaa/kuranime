import { apiClient } from '../api/client'
import type {
  AnimeDetail,
  AnimeListData,
  EpisodeData,
  HomeData,
  ScheduleData,
  StreamData,
} from '../types'
import { buildUrl, createRequestKey, type QueryParams } from '../utils/api'
import { useApi, type UseApiOptions, type UseApiResult } from './useApi'

interface DomainHookOptions<T> extends UseApiOptions<T> {
  endpoint?: string
}

function useGet<T>(path: string | null, options?: DomainHookOptions<T>): UseApiResult<T> {
  const endpoint = options?.endpoint ?? path
  const key = endpoint ? createRequestKey(endpoint) : null
  return useApi(key, (signal) => apiClient.get<T>(endpoint!, { signal }), options)
}

export function useHome(options?: DomainHookOptions<HomeData>) {
  return useGet<HomeData>('/home', options)
}

export interface AnimeListParams extends QueryParams {
  search?: string
  order_by?: string
  genre?: string
  season?: string
  type?: string
  page?: number
}

export function useAnimeList(
  params: AnimeListParams = {},
  options?: DomainHookOptions<AnimeListData>,
) {
  return useGet<AnimeListData>(buildUrl('/anime', params), options)
}

export function useAnimeSearch(
  query: string,
  options?: DomainHookOptions<AnimeListData>,
) {
  const path = query.trim() ? buildUrl('/search', { q: query.trim() }) : null
  return useGet<AnimeListData>(path, {
    ...options,
    enabled: Boolean(query.trim()) && (options?.enabled ?? true),
  })
}

export function useAnimeDetail(
  id: string | undefined,
  slug?: string | undefined,
  options?: DomainHookOptions<AnimeDetail>,
) {
  const path = id ? (slug ? `/anime/${id}/${slug}` : `/anime/${id}`) : null
  return useGet<AnimeDetail>(path, {
    ...options,
    enabled: Boolean(id) && (options?.enabled ?? true),
  })
}

export function useEpisode(
  id: string | undefined,
  ep: string | number | undefined,
  options?: DomainHookOptions<EpisodeData>,
) {
  const path = id && ep ? `/anime/${id}/episode/${ep}` : null
  return useGet<EpisodeData>(path, {
    ...options,
    enabled: Boolean(id && ep) && (options?.enabled ?? true),
  })
}

export function useStream(
  id: string | undefined,
  ep: string | number | undefined,
  server?: string,
  options?: DomainHookOptions<StreamData>,
) {
  const path = id && ep ? buildUrl(`/anime/${id}/episode/${ep}/stream`, { server }) : null
  return useGet<StreamData>(path, {
    ...options,
    enabled: Boolean(id && ep) && (options?.enabled ?? true),
  })
}

export function useSchedule(
  day: string = 'monday',
  options?: DomainHookOptions<ScheduleData>,
) {
  return useGet<ScheduleData>(`/schedule/${day}`, options)
}
