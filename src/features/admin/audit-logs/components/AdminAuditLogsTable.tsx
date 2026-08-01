import { Activity, Boxes, CalendarClock, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import { valueOf } from "@/lib/keyValue"
import type { AdminAuditLogRecord } from "../types/adminAuditLogs.types"

function entityName(value: unknown) {
  return valueOf(value).split("\\").pop() || "-"
}

export default function AdminAuditLogsTable({
  logs,
  isLoading,
  pagination,
  onPageChange,
}: {
  logs: AdminAuditLogRecord[]
  isLoading: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
}) {
  const { t, i18n } = useTranslation("adminAuditLogs")
  const columns: Column<AdminAuditLogRecord>[] = [
    {
      key: "action",
      header: t("columns.action"),
      headerIcon: Activity,
      cell: (log) => (
        <div>
          <p className="font-semibold text-text-primary">{valueOf(log.action, "-")}</p>
          {log.description && (
            <p className="mt-1 max-w-sm text-xs text-text-muted">
              {valueOf(log.description)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "actor",
      header: t("columns.actor"),
      headerIcon: UserRound,
      cell: (log) => {
        const actor = log.actor ?? log.user
        return (
          <div>
            <p className="font-medium text-text-primary">{actor?.name || t("unknownActor")}</p>
            <p className="text-xs text-text-muted">{actor?.email || `#${log.actor_user_id ?? "-"}`}</p>
          </div>
        )
      },
    },
    {
      key: "entity",
      header: t("columns.entity"),
      headerIcon: Boxes,
      cell: (log) => (
        <div>
          <p>{entityName(log.entity_type)}</p>
          <p className="text-xs text-text-muted">#{log.entity_id ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: t("columns.date"),
      headerIcon: CalendarClock,
      cell: (log) =>
        log.created_at
          ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.created_at))
          : "-",
    },
  ]

  return (
    <DataTable
      data={logs}
      columns={columns}
      getRowId={(log) => log.id}
      loading={isLoading}
      pagination={{
        total: pagination?.total ?? logs.length,
        page: pagination?.currentPage ?? 1,
        lastPage: pagination?.lastPage ?? 1,
        perPage: pagination?.perPage,
      }}
      onPageChange={onPageChange}
      emptyMessage={t("empty")}
      emptyDescription={t("emptyDescription")}
      className="rounded-b-2xl mt-4 bg-background-card shadow-card"
    />
  )
}
