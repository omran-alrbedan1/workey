import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminNotificationRecord,
  UnreadCountResponse,
} from "../types/adminNotifications.types"

export const adminNotificationsService = {
  async list(page = 1): Promise<AdminCollection<AdminNotificationRecord>> {
    return unwrapCollection<AdminNotificationRecord>(
      await api.get(API_ENDPOINTS.notifications.list, {
        params: { page, per_page: 15 },
      }),
    )
  },

  async unreadCount(): Promise<number> {
    const value = unwrapEntity<UnreadCountResponse>(
      await api.get(API_ENDPOINTS.notifications.unreadCount),
    )
    return Number(value?.unread_count ?? value?.count ?? (isRecord(value) ? 0 : value)) || 0
  },

  async markRead(id: string | number): Promise<void> {
    await api.patch(API_ENDPOINTS.notifications.markRead(id))
  },

  async markAllRead(): Promise<void> {
    await api.patch(API_ENDPOINTS.notifications.markAllRead)
  },
}
