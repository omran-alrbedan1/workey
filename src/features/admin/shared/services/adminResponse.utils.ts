import { APP_CONFIG } from "@/config"
import type { AdminCollection } from "../types/adminApi.types"

type UnknownRecord = Record<string, unknown>

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function unwrapEntity<T>(response: unknown): T {
  let payload: unknown = response
  if (isRecord(payload) && "data" in payload) payload = payload.data
  if (isRecord(payload) && "data" in payload && !Array.isArray(payload.data)) payload = payload.data
  return payload as T
}

export function unwrapCollection<T>(response: unknown): AdminCollection<T> {
  let payload: unknown = response
  if (isRecord(payload) && "data" in payload) payload = payload.data

  let items: T[] = []
  let paginationSource: UnknownRecord = {}

  if (Array.isArray(payload)) {
    items = payload as T[]
  } else if (isRecord(payload)) {
    if (Array.isArray(payload.data)) items = payload.data as T[]
    else if (Array.isArray(payload.items)) items = payload.items as T[]

    paginationSource = isRecord(payload.meta)
      ? payload.meta
      : isRecord(payload.pagination)
        ? payload.pagination
        : payload
  }

  const total = asNumber(paginationSource.total, items.length)
  const perPage = asNumber(
    paginationSource.per_page ?? paginationSource.perPage,
    Math.max(items.length, APP_CONFIG.pagination.defaultPageSize),
  )

  return {
    items,
    pagination: {
      currentPage: asNumber(paginationSource.current_page ?? paginationSource.currentPage, 1),
      lastPage: asNumber(
        paginationSource.last_page ?? paginationSource.lastPage,
        Math.max(1, Math.ceil(total / perPage)),
      ),
      perPage,
      total,
    },
  }
}
