/**
 * Centralized environment configuration helper.
 * All variables can be configured via .env file.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://kura-api.misaka.biz.id/api'

export const PROXY_BASE_URL =
  (import.meta.env.VITE_PROXY_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://zenproxy.hamdiv.me'
