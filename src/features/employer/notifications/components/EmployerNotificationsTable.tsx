import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerNotification } from "../types/employerNotifications.types"
import { Button } from "@/components/ui/button"
import { CheckCheck, Mail, MailOpen, Bell, Calendar, Trash2 } from "lucide-react"
import {
  isNotificationUnread,
  notificationMessage,
  notificationTitle,
  notificationTypeLabel,
} from "@/shared/notifications/notification.utils"

interface EmployerNotificationMobileCardProps {
  notification: EmployerNotification
  isMarking: boolean
  onMarkRead: (id: string | number) => void
  onDelete: (id: string | number) => void
  onOpen: (notification: EmployerNotification) => void
}

function EmployerNotificationMobileCard({
  notification,
  isMarking,
  onMarkRead,
  onDelete,
  onOpen,
}: EmployerNotificationMobileCardProps) {
  const { t, i18n } = useTranslation("employerNotifications")
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
          {unread ? <Bell className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`truncate font-semibold ${unread ? "text-text-primary" : "text-text-muted"}`}>
            {title || t("fallback")}
          </h3>
          {message && (
            <p className="mt-1 truncate text-xs text-text-muted line-clamp-2">{message}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <span className="capitalize">{notificationTypeLabel(notification, t)}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {notification.created_at
            ? new Date(notification.created_at).toLocaleString(i18n.language, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : t("fallback")}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {unread && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isMarking}
            onClick={(event) => {
              event.stopPropagation()
              onMarkRead(notification.id)
            }}
            className="flex-1"
          >
            <CheckCheck className="h-4 w-4" /> {t("actions.markAsRead")}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={isMarking}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(notification.id)
          }}
          aria-label={t("actions.delete")}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </article>
  )
}

export default function EmployerNotificationsTable({
  collection,
  isLoading,
  isMarking,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onOpen,
  onPageChange,
}: {
  collection?: EmployerCollection<EmployerNotification>
  isLoading: boolean
  isMarking: boolean
  onMarkRead: (id: string | number) => void
  onMarkAllRead: () => void
  onDelete: (id: string | number) => void
  onOpen: (notification: EmployerNotification) => void
  onPageChange: (page: number) => void
}) {
  const { t, i18n } = useTranslation("employerNotifications")

  const columns: Column<EmployerNotification>[] = [
    {
      key: "status",
      header: "",
      width: "48px",
      cell: (item) => (
        <div className="flex justify-center">
          {isNotificationUnread(item) ? (
            <Mail className="h-4 w-4 text-primary" />
          ) : (
            <MailOpen className="h-4 w-4 text-text-muted" />
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: t("columns.title"),
      cell: (item) => {
        const message = notificationMessage(item, t)

        return (
          <div>
            <p className={`text-sm ${isNotificationUnread(item) ? "font-medium text-text-primary" : "text-text-muted"}`}>
              {notificationTitle(item, t) || t("fallback")}
            </p>
            {message && (
              <p className="mt-0.5 text-xs text-text-muted line-clamp-2">{message}</p>
            )}
          </div>
        )
      },
    },
    {
      key: "type",
      header: t("columns.type"),
      cell: (item) => (
        <span className="text-sm capitalize text-text-muted">
          {notificationTypeLabel(item, t)}
        </span>
      ),
    },
    {
      key: "created_at",
      header: t("columns.date"),
      cell: (item) => (
        <span className="text-sm text-text-muted">
          {item.created_at
            ? new Date(item.created_at).toLocaleString(i18n.language, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : t("fallback")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "112px",
      cell: (item) => (
        <div className="flex justify-end gap-1">
          {isNotificationUnread(item) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isMarking}
              onClick={(event) => {
                event.stopPropagation()
                onMarkRead(item.id)
              }}
              aria-label={t("actions.markAsRead")}
            >
              <CheckCheck className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isMarking}
            onClick={(event) => {
              event.stopPropagation()
              onDelete(item.id)
            }}
            aria-label={t("actions.delete")}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const MobileNotificationCard = ({ item }: { item: EmployerNotification }) => (
    <EmployerNotificationMobileCard
      notification={item}
      isMarking={isMarking}
      onMarkRead={onMarkRead}
      onDelete={onDelete}
      onOpen={onOpen}
    />
  )

  return (
    <div className="space-y-4">
      {!isLoading && collection && collection.items.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllRead}
            disabled={isMarking}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            {t("actions.markAllRead")}
          </Button>
        </div>
      )}
      <DataTable
        data={collection?.items ?? []}
        columns={columns}
        getRowId={(item) => item.id}
        loading={isLoading}
        onRowClick={onOpen}
        pagination={{
          total: collection?.pagination.total ?? 0,
          page: collection?.pagination.currentPage ?? 1,
          lastPage: collection?.pagination.lastPage ?? 1,
          perPage: collection?.pagination.perPage,
        }}
        onPageChange={onPageChange}
        emptyMessage={t("empty.title")}
        emptyDescription={t("empty.description")}
        className="bg-background-card shadow-card"
        mobileCardComponent={MobileNotificationCard}
      />
    </div>
  )
}
