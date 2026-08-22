import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapCollection } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type { AdminAuditLogFilters, AdminAuditLogRecord } from "../types/adminAuditLogs.types"

const auditLogsPageSize = 15
const auditLogsFallbackPageSize = 100

function isServerError(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 500,
  )
}

function paramsFor(filters: AdminAuditLogFilters, page: number, perPage: number) {
  const params: Record<string, unknown> = {
    page,
    per_page: perPage,
  }
  const action = filters.action?.trim()
  const entityType = filters.entity_type?.trim()
  const actorUserId = filters.actor_user_id?.trim()
  if (action) params.action = action
  if (entityType) params.entity_type = entityType
  if (actorUserId) params.actor_user_id = actorUserId
  return params
}

async function fetchAuditLogs(filters: AdminAuditLogFilters, page: number, perPage: number) {
  return unwrapCollection<AdminAuditLogRecord>(
    await api.get(API_ENDPOINTS.admin.auditLogs, {
      params: paramsFor(filters, page, perPage),
    }),
  )
}

async function fetchAuditLogsWithoutParams() {
  return unwrapCollection<AdminAuditLogRecord>(await api.get(API_ENDPOINTS.admin.auditLogs))
}

function text(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const record = value as { key?: unknown; value?: unknown; label?: unknown; name?: unknown }
    return String(record.key ?? record.value ?? record.label ?? record.name ?? "")
  }
  return ""
}

function matchesFilters(log: AdminAuditLogRecord, filters: AdminAuditLogFilters) {
  const action = filters.action?.trim().toLowerCase()
  const entityType = filters.entity_type?.trim().toLowerCase()
  const actorUserId = filters.actor_user_id?.trim()

  if (action && !text(log.action).toLowerCase().includes(action)) return false
  if (entityType && !text(log.entity_type).toLowerCase().includes(entityType)) return false
  if (
    actorUserId &&
    String(log.actor_user_id ?? log.actor?.id ?? log.user?.id ?? "") !== actorUserId
  ) {
    return false
  }

  return true
}

async function fetchAuditLogsClientPaginated(filters: AdminAuditLogFilters, page: number) {
  const collection = await fetchAuditLogsWithoutParams()
  const filteredItems = collection.items.filter((log) => matchesFilters(log, filters))
  const start = (page - 1) * auditLogsPageSize
  const items = filteredItems.slice(start, start + auditLogsPageSize)
  const total = filteredItems.length

  return {
    items,
    pagination: {
      currentPage: page,
      lastPage: Math.max(1, Math.ceil(total / auditLogsPageSize)),
      perPage: auditLogsPageSize,
      total,
    },
  }
}

export const adminAuditLogsService = {
  async list(
    filters: AdminAuditLogFilters,
    page = 1,
  ): Promise<AdminCollection<AdminAuditLogRecord>> {
    try {
      return await fetchAuditLogs(filters, page, auditLogsPageSize)
    } catch (error) {
      if (isServerError(error)) {
        return fetchAuditLogsClientPaginated(filters, page)
      }

      if (page <= 1) throw error

      const collection = await fetchAuditLogs(filters, 1, auditLogsFallbackPageSize)
      const start = (page - 1) * auditLogsPageSize
      const items = collection.items.slice(start, start + auditLogsPageSize)
      const total = collection.pagination.total || collection.items.length

      return {
        items,
        pagination: {
          currentPage: page,
          lastPage: Math.max(1, Math.ceil(total / auditLogsPageSize)),
          perPage: auditLogsPageSize,
          total,
        },
      }
    }
  },
}
