export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Record<string, QueryValue | QueryValue[]>

export function buildUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!query) return normalizedPath

  const search = new URLSearchParams()
  for (const [key, rawValue] of Object.entries(query)) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue]
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        search.append(key, String(value))
      }
    }
  }

  const queryString = search.toString()
  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath
}

export function createRequestKey(
  path: string,
  init?: Pick<RequestInit, 'method' | 'body'>,
): string {
  const method = init?.method?.toUpperCase() ?? 'GET'
  const body = typeof init?.body === 'string' ? init.body : ''
  return `${method}:${path}:${body}`
}
