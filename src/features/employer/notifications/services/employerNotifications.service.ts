import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapEmployerCollection,
  unwrapEmployerEntity,
  type EmployerCollection,
} from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerNotification, EmployerUnreadCount } from "../types/employerNotifications.types"

export const employerNotificationsService = {
  async list(page = 1): Promise<EmployerCollection<EmployerNotification>> {
    return unwrapEmployerCollection<EmployerNotification>(
      await api.get(API_ENDPOINTS.notifications.list, {
        params: { page, per_page: 15 },
      }),
    )
  },

  async getUnreadCount(): Promise<EmployerUnreadCount> {
    return unwrapEmployerEntity<EmployerUnreadCount>(
      await api.get(API_ENDPOINTS.notifications.unreadCount),
    )
  },

  async markRead(id: string | number): Promise<void> {
    await api.patch(API_ENDPOINTS.notifications.markRead(id))
  },

  async markAllRead(): Promise<void> {
    await api.patch(API_ENDPOINTS.notifications.markAllRead)
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.notifications.delete(id))
  },
}
