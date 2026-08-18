import { Activity, Boxes, CalendarClock, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import { valueOf } from "@/lib/keyValue"
import type { AdminAuditLogRecord } from "../types/adminAuditLogs.types"

function entityName(value: unknown) {
  return valueOf(value).split("\\").pop() || "-"
}

interface AdminAuditLogMobileCardProps {
  log: AdminAuditLogRecord
}

const AdminAuditLogMobileCard = ({ log }: AdminAuditLogMobileCardProps) => {
  const { t, i18n } = useTranslation("adminAuditLogs")
  const actor = log.actor ?? log.user

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Activity className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{valueOf(log.action, "-")}</h3>
          {log.description && (
            <p className="truncate text-xs text-text-muted">{valueOf(log.description)}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <UserRound className="h-3.5 w-3.5 text-primary" />
          <span className="truncate">
            {valueOf(actor?.name, t("unknownActor"))}
            {actor?.email && <span className="text-text-muted"> ({valueOf(actor.email)})</span>}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Boxes className="h-3.5 w-3.5 text-primary" />
          {entityName(log.entity_type)}
          <span className="text-text-muted">#{log.entity_id ?? "-"}</span>
        </p>
        {log.created_at && (
          <p className="flex items-center gap-2">
            <CalendarClock className="h-3.5 w-3.5 text-primary" />
            {new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.created_at))}
          </p>
        )}
      </div>
    </article>
  )
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
            <p className="font-medium text-text-primary">
              {valueOf(actor?.name, t("unknownActor"))}
            </p>
            <p className="text-xs text-text-muted">
              {valueOf(actor?.email, `#${log.actor_user_id ?? "-"}`)}
            </p>
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
      mobileCardComponent={AdminAuditLogMobileCard}
      emptyMessage={t("empty")}
      emptyDescription={t("emptyDescription")}
      className="rounded-b-2xl mt-4 bg-background-card shadow-card"
    />
  )
}
