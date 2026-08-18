import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerNotification } from "../types/employerNotifications.types"
import { Button } from "@/components/ui/button"
import { CheckCheck, Mail, MailOpen, Bell, Calendar } from "lucide-react"

interface EmployerNotificationMobileCardProps {
  notification: EmployerNotification
  isMarking: boolean
  onMarkRead: (id: string | number) => void
}

function EmployerNotificationMobileCard({
  notification,
  isMarking,
  onMarkRead,
}: EmployerNotificationMobileCardProps) {
  const { t, i18n } = useTranslation("employerNotifications")

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          {notification.read_at || notification.is_read ? (
            <MailOpen className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`truncate font-semibold ${notification.read_at || notification.is_read ? "text-text-muted" : "text-text-primary"}`}>
            {notification.title || "—"}
          </h3>
          {notification.message && (
            <p className="mt-1 truncate text-xs text-text-muted line-clamp-2">{notification.message}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <span className="capitalize">
            {notification.type ? t(`types.${notification.type}`, notification.type) : "—"}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {notification.created_at
            ? new Date(notification.created_at).toLocaleString(i18n.language, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "—"}
        </p>
      </div>

      <div className="mt-4">
        {!(notification.read_at || notification.is_read) && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isMarking}
            onClick={() => onMarkRead(notification.id)}
            className="w-full"
          >
            <CheckCheck className="mr-2 h-4 w-4" /> {t("actions.markAsRead")}
          </Button>
        )}
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
  onPageChange,
}: {
  collection?: EmployerCollection<EmployerNotification>
  isLoading: boolean
  isMarking: boolean
  onMarkRead: (id: string | number) => void
  onMarkAllRead: () => void
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
          {item.read_at || item.is_read ? (
            <MailOpen className="h-4 w-4 text-text-muted" />
          ) : (
            <Mail className="h-4 w-4 text-primary" />
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: t("columns.title"),
      cell: (item) => (
        <div>
          <p className={`text-sm ${item.read_at || item.is_read ? "text-text-muted" : "font-medium text-text-primary"}`}>
            {item.title || "—"}
          </p>
          {item.message && (
            <p className="mt-0.5 text-xs text-text-muted line-clamp-2">{item.message}</p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: t("columns.type"),
      cell: (item) => (
        <span className="text-sm capitalize text-text-muted">
          {item.type ? t(`types.${item.type}`, item.type) : "—"}
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
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "64px",
      cell: (item) =>
        item.read_at || item.is_read ? null : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isMarking}
            onClick={(e) => {
              e.stopPropagation()
              onMarkRead(item.id)
            }}
          >
            <CheckCheck className="h-4 w-4 text-primary" />
          </Button>
        ),
    },
  ]

  const MobileNotificationCard = ({ item }: { item: EmployerNotification }) => (
    <EmployerNotificationMobileCard
      notification={item}
      isMarking={isMarking}
      onMarkRead={onMarkRead}
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
