import { getStoredToken } from './storage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH'
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const token = options.token ?? getStoredToken()
  const headers = new Headers()

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(
      `Cannot reach API server at ${API_BASE_URL || 'the current app origin via /api proxy'}. Make sure the backend is running and VITE_API_BASE_URL is correct.`,
      0,
    )
  }

  const rawText = await response.text()
  const payload = rawText ? JSON.parse(rawText) : null

  if (!response.ok) {
    const message =
      payload?.message instanceof Array
        ? payload.message.join(', ')
        : payload?.message || 'Request failed.'
    throw new ApiError(message, response.status)
  }

  return payload as T
}
