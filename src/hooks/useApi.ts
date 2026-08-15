import { useCallback, useEffect, useRef, useState } from 'react'

interface CacheEntry<T> {
  data?: T
  error?: Error
  expiresAt: number
  promise?: Promise<T>
  controller?: AbortController
  subscribers: number
}

export interface UseApiOptions<T> {
  enabled?: boolean
  staleTime?: number
  initialData?: T
}

export interface UseApiResult<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
  isFetching: boolean
  refetch: () => Promise<T | undefined>
}

const requestCache = new Map<string, CacheEntry<unknown>>()
const DEFAULT_STALE_TIME = 30_000

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

function getEntry<T>(key: string): CacheEntry<T> {
  let entry = requestCache.get(key) as CacheEntry<T> | undefined
  if (!entry) {
    entry = { expiresAt: 0, subscribers: 0 }
    requestCache.set(key, entry)
  }
  return entry
}

function loadRequest<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  staleTime: number,
  force = false,
): Promise<T> {
  const entry = getEntry<T>(key)
  const now = Date.now()

  // Return cached data if still fresh
  if (!force && entry.data !== undefined && entry.expiresAt > now) {
    return Promise.resolve(entry.data)
  }

  // Return in-flight promise if one exists (deduplication)
  if (entry.promise) return entry.promise

  const controller = new AbortController()
  entry.controller = controller
  entry.error = undefined

  entry.promise = fetcher(controller.signal)
    .then((data) => {
      entry.data = data
      entry.error = undefined
      entry.expiresAt = Date.now() + staleTime
      return data
    })
    .catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        entry.error = toError(error)
      }
      throw error
    })
    .finally(() => {
      entry.promise = undefined
      entry.controller = undefined
    })

  return entry.promise
}

export function clearApiCache(key?: string): void {
  if (key) {
    requestCache.get(key)?.controller?.abort()
    requestCache.delete(key)
    return
  }
  for (const entry of requestCache.values()) entry.controller?.abort()
  requestCache.clear()
}

export function useApi<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: UseApiOptions<T> = {},
): UseApiResult<T> {
  const { enabled = true, staleTime = DEFAULT_STALE_TIME, initialData } = options
  const fetcherRef = useRef(fetcher)
  const [data, setData] = useState<T | undefined>(() => {
    if (!key) return initialData
    const entry = getEntry<T>(key)
    return entry.data ?? initialData
  })
  const [error, setError] = useState<Error | undefined>(() => {
    if (!key) return undefined
    const entry = getEntry<T>(key)
    return entry.error
  })
  const [isFetching, setIsFetching] = useState(false)

  // Keep fetcher ref up-to-date
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const execute = useCallback(async (force = false): Promise<T | undefined> => {
    if (!key || !enabled) return undefined
    setIsFetching(true)
    try {
      const result = await loadRequest(key, (signal) => fetcherRef.current(signal), staleTime, force)
      setData(result)
      setError(undefined)
      return result
    } catch (requestError) {
      if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) {
        setError(toError(requestError))
      }
      return undefined
    } finally {
      setIsFetching(false)
    }
  }, [enabled, key, staleTime])

  useEffect(() => {
    if (!key || !enabled) return

    const entry = getEntry<T>(key)
    entry.subscribers += 1
    let active = true

    Promise.resolve().then(() => {
      if (active) setIsFetching(true)
    })

    loadRequest(key, (signal) => fetcherRef.current(signal), staleTime)
      .then((result) => {
        if (!active) return
        setData(result)
        setError(undefined)
      })
      .catch((requestError: unknown) => {
        if (active && !(requestError instanceof DOMException && requestError.name === 'AbortError')) {
          setError(toError(requestError))
        }
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })

    return () => {
      active = false
      entry.subscribers -= 1

      // Delay abort to allow React StrictMode remount to re-subscribe.
      // Without this, StrictMode's unmount→remount cycle would always
      // cancel the in-flight request because subscribers momentarily hits 0.
      if (entry.subscribers === 0 && entry.controller) {
        const ctrl = entry.controller
        setTimeout(() => {
          // Only abort if still no subscribers after the microtask window
          if (entry.subscribers === 0 && entry.controller === ctrl) {
            ctrl.abort()
          }
        }, 50)
      }
    }
  }, [enabled, key, staleTime])

  return {
    data,
    error,
    isLoading: isFetching && data === undefined,
    isFetching,
    refetch: useCallback(() => execute(true), [execute]),
  }
}
