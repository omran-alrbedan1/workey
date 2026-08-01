import { CheckCheck } from "lucide-react"
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

export default function AdminNotificationsTable({
  notifications, isLoading, isUpdating, pagination, onPageChange, onRead,
}: AdminNotificationsTableProps) {
  const { t, i18n } = useTranslation("adminNotifications")
  const columns: Column<AdminNotificationRecord>[] = [
    {
      key: "notification", header: t("columns.notification"),
      cell: (item) => (
        <div>
          <p className="font-semibold text-text-primary">{item.title || item.type || t("platformNotification")}</p>
          <p className="max-w-lg truncate text-xs text-text-muted">{item.message || t("details")}</p>
        </div>
      ),
    },
    { key: "status", header: t("columns.status"), cell: (item) => <StatusBadge status={item.read_at ? "read" : "unread"} variant="soft" /> },
    { key: "date", header: t("columns.received"), cell: (item) => item.created_at ? new Date(item.created_at).toLocaleString(i18n.language) : "-" },
    {
      key: "action", header: t("columns.action"), className: "text-right",
      cell: (item) => item.read_at ? "-" : (
        <Button size="sm" variant="outline" disabled={isUpdating} onClick={() => onRead(item.id)}>
          <CheckCheck /> {t("markRead")}
        </Button>
      ),
    },
  ]
  return (
    <DataTable
      data={notifications} columns={columns} getRowId={(item) => item.id} loading={isLoading}
      pagination={{ total: pagination?.total ?? notifications.length, page: pagination?.currentPage ?? 1, lastPage: pagination?.lastPage ?? 1, perPage: pagination?.perPage }}
      onPageChange={onPageChange} emptyMessage={t("empty")} emptyDescription={t("emptyDescription")}
      emptyImage={images.notifications} emptyImageAlt={t("empty")} className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
