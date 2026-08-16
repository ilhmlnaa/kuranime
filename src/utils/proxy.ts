import { PROXY_BASE_URL } from './env'

export interface ProxiedVideoSource {
  url: string
  type: 'video' | 'hls'
}

export function getProxiedVideoSource(
  rawUrl: string | undefined | null,
): ProxiedVideoSource | null {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  const isHls = /\.m3u8(?:[?#]|$)/i.test(trimmed)
  const endpoint = isHls ? '/hls' : '/video'

  return {
    url: `${PROXY_BASE_URL}${endpoint}?url=${encodeURIComponent(trimmed)}`,
    type: isHls ? 'hls' : 'video',
  }
}
