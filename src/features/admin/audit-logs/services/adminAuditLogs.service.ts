import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapCollection } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminAuditLogFilters,
  AdminAuditLogRecord,
} from "../types/adminAuditLogs.types"

export const adminAuditLogsService = {
  async list(
    filters: AdminAuditLogFilters,
    page = 1,
  ): Promise<AdminCollection<AdminAuditLogRecord>> {
    const params: Record<string, unknown> = {
      page,
      per_page: 15,
    }
    if (filters.action) params.action = filters.action
    if (filters.entity_type) params.entity_type = filters.entity_type
    if (filters.actor_user_id) params.actor_user_id = filters.actor_user_id
    return unwrapCollection<AdminAuditLogRecord>(
      await api.get(API_ENDPOINTS.admin.auditLogs, { params }),
    )
  },
}
