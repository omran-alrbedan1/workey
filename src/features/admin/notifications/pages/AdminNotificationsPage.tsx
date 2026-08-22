import { Bell, CheckCheck } from "lucide-react"
import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminNotificationsTable from "../components/AdminNotificationsTable"
import { useAdminNotifications } from "../hooks/useAdminNotifications"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  isNotificationUnread,
  resolveNotificationTarget,
} from "@/shared/notifications/notification.utils"
import type { AdminNotificationRecord } from "../types/adminNotifications.types"

export default function AdminNotificationsPage() {
  const { t } = useTranslation("adminNotifications")
  const notifications = useAdminNotifications()
  const navigate = useNavigate()
  const updating =
    notifications.markReadMutation.isPending || notifications.markAllReadMutation.isPending

  const openNotification = (notification: AdminNotificationRecord) => {
    if (isNotificationUnread(notification)) {
      notifications.markReadMutation.mutate(notification.id)
    }

    const target = resolveNotificationTarget(notification, "admin")
    if (target) navigate(target)
  }

  if (notifications.isError)
    return (
      <AdminFeatureError
        title={t("title")}
        error={notifications.error}
        retry={() => {
          void notifications.refetch()
        }}
      />
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description", { count: notifications.unreadCount })}
        icon={Bell}
        count={notifications.data?.pagination.total}
        rightContent={
          <Button
            type="button"
            variant="outline"
            disabled={notifications.unreadCount === 0 || updating}
            onClick={() => notifications.markAllReadMutation.mutate()}
          >
            <CheckCheck />
            {notifications.markAllReadMutation.isPending ? t("markingAllRead") : t("markAllRead")}
          </Button>
        }
      />
      <AdminNotificationsTable
        notifications={notifications.data?.items ?? []}
        isLoading={notifications.isPending}
        isUpdating={updating}
        pagination={notifications.data?.pagination}
        onPageChange={notifications.setPage}
        onRead={(id) => notifications.markReadMutation.mutate(id)}
        onOpen={openNotification}
      />
    </div>
  )
}
