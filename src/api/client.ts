export const API_BASE_URL = 'https://kura-api.misaka.biz.id/api'

export interface ApiErrorDetails {
  status: number
  statusText: string
  url: string
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly body?: unknown

  constructor(message: string, details: ApiErrorDetails, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = details.status
    this.statusText = details.statusText
    this.url = details.url
    this.body = details.body
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null
}

function isBodyInit(value: unknown): value is BodyInit {
  return (
    typeof value === 'string' ||
    value instanceof Blob ||
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof ReadableStream
  )
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || undefined
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const url = /^https?:\/\//i.test(path)
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)
  let body: BodyInit | null | undefined

  if (options.body == null || isBodyInit(options.body)) {
    body = options.body
  } else {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }

  headers.set('Accept', 'application/json')

  let response: Response
  try {
    response = await fetch(url, { ...options, headers, body })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      { status: 0, statusText: 'NETWORK_ERROR', url },
      { cause: error },
    )
  }

  let payload: unknown
  try {
    payload = await parseResponse(response)
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        url,
      }, { cause: error })
    }
    throw new ApiError('Failed to parse API response', {
      status: response.status,
      statusText: response.statusText,
      url,
    }, { cause: error })
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String(payload.message)
        : `Request failed with status ${response.status}`
    throw new ApiError(message, {
      status: response.status,
      statusText: response.statusText,
      url,
      body: payload,
    })
  }

  // Auto-unwrap envelope jika API mengembalikan { success: true, data: ... }
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    'data' in payload
  ) {
    return (payload as { data: unknown }).data as T
  }

  return payload as T
}

export const apiClient = {
  get<T>(path: string, options?: ApiRequestOptions) {
    return apiRequest<T>(path, { ...options, method: 'GET' })
  },
  post<T>(path: string, body?: ApiRequestOptions['body'], options?: ApiRequestOptions) {
    return apiRequest<T>(path, { ...options, method: 'POST', body })
  },
}
