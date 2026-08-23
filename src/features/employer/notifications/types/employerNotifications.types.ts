import type { NotificationRecordBase } from "@/shared/notifications/types"

export type EmployerNotification = NotificationRecordBase

export interface EmployerUnreadCount {
  count: number
  unread_count?: number
}
