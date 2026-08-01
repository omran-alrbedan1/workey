import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapCollection } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminAuditLogFilters,
  AdminAuditLogRecord,
} from "../types/adminAuditLogs.types"

const auditLogsPageSize = 15
const auditLogsFallbackPageSize = 100

function paramsFor(filters: AdminAuditLogFilters, page: number, perPage: number) {
  const params: Record<string, unknown> = {
    page,
    per_page: perPage,
  }
  if (filters.action) params.action = filters.action
  if (filters.entity_type) params.entity_type = filters.entity_type
  if (filters.actor_user_id) params.actor_user_id = filters.actor_user_id
  return params
}

async function fetchAuditLogs(
  filters: AdminAuditLogFilters,
  page: number,
  perPage: number,
) {
  return unwrapCollection<AdminAuditLogRecord>(
    await api.get(API_ENDPOINTS.admin.auditLogs, {
      params: paramsFor(filters, page, perPage),
    }),
  )
}

export const adminAuditLogsService = {
  async list(
    filters: AdminAuditLogFilters,
    page = 1,
  ): Promise<AdminCollection<AdminAuditLogRecord>> {
    try {
      return await fetchAuditLogs(filters, page, auditLogsPageSize)
    } catch (error) {
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
