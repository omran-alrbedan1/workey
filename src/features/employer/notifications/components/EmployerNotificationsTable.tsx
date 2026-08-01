import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerNotification } from "../types/employerNotifications.types"
import { Button } from "@/components/ui/button"
import { CheckCheck, Mail, MailOpen } from "lucide-react"

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
      />
    </div>
  )
}
