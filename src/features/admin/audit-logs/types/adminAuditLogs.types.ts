import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export interface AdminAuditLogActor {
  id?: string | number
  name?: AdminKeyValueField
  email?: AdminKeyValueField
}

export interface AdminAuditLogRecord {
  id: string | number
  action: AdminKeyValueField
  actor_user_id?: string | number | null
  actor?: AdminAuditLogActor | null
  entity_type?: string | null
  entity?: AdminKeyValueField | null
  entity_id?: string | number | null
  before_values?: Record<string, unknown> | null
  after_values?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  ip_address?: string | null
  user_agent?: string | null
  created_at?: string
}

export interface AdminAuditLogFilters {
  action?: string
  entity_type?: string
  actor_user_id?: string
  entity_id?: string
  date_from?: string
  date_to?: string
}
