import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { UnreadCountResponse } from "./types"

export const notificationsService = {
  async unreadCount(): Promise<number> {
    const value = unwrapEntity<UnreadCountResponse>(
      await api.get(API_ENDPOINTS.notifications.unreadCount),
    )
    return Number(value?.unread_count ?? value?.count ?? (isRecord(value) ? 0 : value)) || 0
  },
}
