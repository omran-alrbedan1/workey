import { APP_CONFIG } from "@/config"

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function unwrapEmployerEntity<T>(response: unknown): T {
  let payload = response

  if (isRecord(payload) && "data" in payload) payload = payload.data
  if (isRecord(payload) && "data" in payload && !Array.isArray(payload.data)) {
    payload = payload.data
  }

  return payload as T
}

export interface EmployerCollection<T> {
  items: T[]
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function unwrapEmployerCollection<T>(response: unknown): EmployerCollection<T> {
  let payload = response
  if (isRecord(payload) && "data" in payload) payload = payload.data

  let items: T[] = []
  let meta: Record<string, unknown> = {}

  if (Array.isArray(payload)) {
    items = payload as T[]
  } else if (isRecord(payload)) {
    if (Array.isArray(payload.data)) items = payload.data as T[]
    else if (Array.isArray(payload.items)) items = payload.items as T[]
    meta = isRecord(payload.meta)
      ? payload.meta
      : isRecord(payload.pagination)
        ? payload.pagination
        : payload
  }

  const total = asNumber(meta.total, items.length)
  const perPage = asNumber(
    meta.per_page ?? meta.perPage,
    Math.max(items.length, APP_CONFIG.pagination.defaultPageSize),
  )

  return {
    items,
    pagination: {
      currentPage: asNumber(meta.current_page ?? meta.currentPage, 1),
      lastPage: asNumber(meta.last_page ?? meta.lastPage, Math.max(1, Math.ceil(total / perPage))),
      perPage,
      total,
    },
  }
}
