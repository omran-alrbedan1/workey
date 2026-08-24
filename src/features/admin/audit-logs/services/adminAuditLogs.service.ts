import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapCollection } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type { AdminAuditLogFilters, AdminAuditLogRecord } from "../types/adminAuditLogs.types"

const auditLogsPageSize = 15

function paramsFor(filters: AdminAuditLogFilters, page: number, perPage: number) {
  const params: Record<string, unknown> = {
    page,
    per_page: perPage,
  }
  const action = filters.action?.trim()
  const entityType = filters.entity_type?.trim()
  const actorUserId = filters.actor_user_id?.trim()
  const entityId = filters.entity_id?.trim()
  const dateFrom = filters.date_from?.trim()
  const dateTo = filters.date_to?.trim()
  if (action) params.action = action
  if (entityType) params.entity_type = entityType
  if (actorUserId) params.actor_user_id = actorUserId
  if (entityId) params.entity_id = entityId
  if (dateFrom) params.date_from = dateFrom
  if (dateTo) params.date_to = dateTo
  return params
}

export const adminAuditLogsService = {
  async list(
    filters: AdminAuditLogFilters,
    page = 1,
  ): Promise<AdminCollection<AdminAuditLogRecord>> {
    return unwrapCollection<AdminAuditLogRecord>(
      await api.get(API_ENDPOINTS.admin.auditLogs, {
        params: paramsFor(filters, page, auditLogsPageSize),
      }),
    )
  },
}
