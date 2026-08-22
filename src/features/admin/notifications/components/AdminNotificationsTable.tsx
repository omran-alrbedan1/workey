import { CheckCheck, Bell, ShieldCheck, Calendar, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminNotificationRecord } from "../types/adminNotifications.types"
import { images } from "@/constants/images"
import {
  isNotificationUnread,
  notificationMessage,
  notificationTitle,
  notificationTypeLabel,
} from "@/shared/notifications/notification.utils"

interface AdminNotificationsTableProps {
  notifications: AdminNotificationRecord[]
  isLoading: boolean
  isUpdating: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
  onRead: (id: string | number) => void
  onDelete: (id: string | number) => void
  onOpen: (notification: AdminNotificationRecord) => void
}

interface AdminNotificationMobileCardProps {
  notification: AdminNotificationRecord
  isUpdating: boolean
  onRead: (id: string | number) => void
  onDelete: (id: string | number) => void
  onOpen: (notification: AdminNotificationRecord) => void
}

const AdminNotificationMobileCard = ({
  notification,
  isUpdating,
  onRead,
  onDelete,
  onOpen,
}: AdminNotificationMobileCardProps) => {
  const { t, i18n } = useTranslation("adminNotifications")
  const unread = isNotificationUnread(notification)
  const title = notificationTitle(notification, t)
  const message = notificationMessage(notification, t)
  return (
    <article
      className="cursor-pointer rounded-2xl border border-border bg-background-card p-4 shadow-card transition-colors hover:bg-background-secondary/60"
      onClick={() => onOpen(notification)}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Bell className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">
            {title || t("platformNotification")}
          </h3>
          <p className="truncate text-xs text-text-muted">
            {message || t("details")}
          </p>
        </div>
        <StatusBadge status={unread ? "unread" : "read"} variant="soft" />
      </div>

      {notification.created_at && (
        <div className="mt-3 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
          <p className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {new Date(notification.created_at).toLocaleString(i18n.language)}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {unread && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            disabled={isUpdating}
            onClick={(event) => {
              event.stopPropagation()
              onRead(notification.id)
            }}
          >
            <CheckCheck className="h-4 w-4" />
            {t("markRead")}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          disabled={isUpdating}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(notification.id)
          }}
          aria-label={t("delete")}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </article>
  )
}

export default function AdminNotificationsTable({
  notifications, isLoading, isUpdating, pagination, onPageChange, onRead, onDelete, onOpen,
}: AdminNotificationsTableProps) {
  const { t, i18n } = useTranslation("adminNotifications")
  const columns: Column<AdminNotificationRecord>[] = [
    {
      key: "notification",
      header: t("columns.notification"),
      headerIcon: Bell,
      cell: (item) => (
        <div>
          <p className="font-semibold text-text-primary">{notificationTitle(item, t) || t("platformNotification")}</p>
          <p className="max-w-lg truncate text-xs text-text-muted">{notificationMessage(item, t) || t("details")}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: ShieldCheck,
      cell: (item) => <StatusBadge status={isNotificationUnread(item) ? "unread" : "read"} variant="soft" />,
    },
    {
      key: "type",
      header: t("columns.type"),
      cell: (item) => notificationTypeLabel(item, t),
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
      cell: (item) => (
        <div className="flex justify-end gap-2">
          {isNotificationUnread(item) && (
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={(event) => {
                event.stopPropagation()
                onRead(item.id)
              }}
            >
              <CheckCheck /> {t("markRead")}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            disabled={isUpdating}
            onClick={(event) => {
              event.stopPropagation()
              onDelete(item.id)
            }}
            aria-label={t("delete")}
          >
            <Trash2 className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const MobileNotificationCard = ({ item }: { item: AdminNotificationRecord }) => (
    <AdminNotificationMobileCard
      notification={item}
      isUpdating={isUpdating}
      onRead={onRead}
      onDelete={onDelete}
      onOpen={onOpen}
    />
  )

  return (
    <DataTable
      data={notifications} columns={columns} getRowId={(item) => item.id} loading={isLoading}
      onRowClick={onOpen}
      pagination={{ total: pagination?.total ?? notifications.length, page: pagination?.currentPage ?? 1, lastPage: pagination?.lastPage ?? 1, perPage: pagination?.perPage }}
      onPageChange={onPageChange}
      mobileCardComponent={MobileNotificationCard}
      emptyMessage={t("empty")} emptyDescription={t("emptyDescription")}
      emptyImage={images.notifications} emptyImageAlt={t("empty")} className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
