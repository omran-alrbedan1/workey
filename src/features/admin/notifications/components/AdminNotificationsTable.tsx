import { CheckCheck, Bell, ShieldCheck, Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminNotificationRecord } from "../types/adminNotifications.types"
import { images } from "@/constants/images"

interface AdminNotificationsTableProps {
  notifications: AdminNotificationRecord[]
  isLoading: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
  onRead: (id: string | number) => void
}

interface AdminNotificationMobileCardProps {
  notification: AdminNotificationRecord
  isUpdating: boolean
  onRead: (id: string | number) => void
}

const AdminNotificationMobileCard = ({
  notification,
  isUpdating,
  onRead,
}: AdminNotificationMobileCardProps) => {
  const { t, i18n } = useTranslation("adminNotifications")
  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Bell className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">
            {notification.title || notification.type || t("platformNotification")}
          </h3>
          <p className="truncate text-xs text-text-muted">
            {notification.message || t("details")}
          </p>
        </div>
        <StatusBadge status={notification.read_at ? "read" : "unread"} variant="soft" />
      </div>

      {notification.created_at && (
        <div className="mt-3 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
          <p className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {new Date(notification.created_at).toLocaleString(i18n.language)}
          </p>
        </div>
      )}

      {!notification.read_at && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            disabled={isUpdating}
            onClick={() => onRead(notification.id)}
          >
            <CheckCheck className="h-4 w-4" />
            {t("markRead")}
          </Button>
        </div>
      )}
    </article>
  )
}

export default function AdminNotificationsTable({
  notifications, isLoading, isUpdating, pagination, onPageChange, onRead,
}: AdminNotificationsTableProps) {
  const { t, i18n } = useTranslation("adminNotifications")
  const columns: Column<AdminNotificationRecord>[] = [
    {
      key: "notification",
      header: t("columns.notification"),
      headerIcon: Bell,
      cell: (item) => (
        <div>
          <p className="font-semibold text-text-primary">{item.title || item.type || t("platformNotification")}</p>
          <p className="max-w-lg truncate text-xs text-text-muted">{item.message || t("details")}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: ShieldCheck,
      cell: (item) => <StatusBadge status={item.read_at ? "read" : "unread"} variant="soft" />,
    },
    {
      key: "date",
      header: t("columns.received"),
      headerIcon: Calendar,
      cell: (item) => item.created_at ? new Date(item.created_at).toLocaleString(i18n.language) : "-",
    },
    {
      key: "action",
      header: t("columns.action"),
      className: "text-end",
      cell: (item) => item.read_at ? "-" : (
        <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => onRead(item.id)}>
          <CheckCheck /> {t("markRead")}
        </Button>
      ),
    },
  ]

  const MobileNotificationCard = ({ item }: { item: AdminNotificationRecord }) => (
    <AdminNotificationMobileCard
      notification={item}
      isUpdating={isUpdating}
      onRead={onRead}
    />
  )

  return (
    <DataTable
      data={notifications} columns={columns} getRowId={(item) => item.id} loading={isLoading}
      pagination={{ total: pagination?.total ?? notifications.length, page: pagination?.currentPage ?? 1, lastPage: pagination?.lastPage ?? 1, perPage: pagination?.perPage }}
      onPageChange={onPageChange}
      mobileCardComponent={MobileNotificationCard}
      emptyMessage={t("empty")} emptyDescription={t("emptyDescription")}
      emptyImage={images.notifications} emptyImageAlt={t("empty")} className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
