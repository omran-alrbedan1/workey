import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export interface AdminAuditLogActor {
  id?: string | number
  name?: string
  email?: string
}

export interface AdminAuditLogRecord {
  id: string | number
  action: AdminKeyValueField
  actor_user_id?: string | number | null
  actor?: AdminAuditLogActor | null
  user?: AdminAuditLogActor | null
  entity_type?: AdminKeyValueField
  entity_id?: string | number | null
  description?: AdminKeyValueField
  metadata?: Record<string, unknown> | null
  properties?: Record<string, unknown> | null
  ip_address?: string | null
  created_at?: string
}

export interface AdminAuditLogFilters {
  action?: string
  entity_type?: string
  actor_user_id?: string
}
