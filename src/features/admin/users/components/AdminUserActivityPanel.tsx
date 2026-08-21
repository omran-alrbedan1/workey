import { Activity, ClipboardList, MonitorSmartphone } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserActivityItem, AdminUserDetails } from "../types/adminUsers.types"

export type AdminUserActivityLogsVariant = "both" | "activity" | "audit"

interface AdminUserActivityPanelProps {
  user: AdminUserDetails
  logs?: AdminUserActivityLogsVariant
}

export default function AdminUserActivityPanel({
  user,
  logs = "both",
}: AdminUserActivityPanelProps) {
  const { t, i18n } = useTranslation("adminUsers")
  const formatDate = (input: string) => {
    const date = new Date(input)
    return Number.isNaN(date.getTime())
      ? input
      : new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date)
  }
  const renderItems = (items: AdminUserActivityItem[] | undefined, emptyKey: string) => {
    if (items === undefined) return <UnavailableNotice />

    return items.length ? (
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-border bg-background-secondary/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-text-primary">{item.action}</p>
                {item.description ? (
                  <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                ) : null}
              </div>
              {item.type ? <StatusBadge status={item.type} variant="soft" /> : null}
            </div>
            <p className="mt-3 text-xs text-text-muted">
              {t("activity.meta", {
                actor: item.actor_name || t("fallbacks.system"),
                date: formatDate(item.created_at),
              })}
            </p>
            {item.ip_address || item.user_agent ? (
              <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-text-muted">
                <MonitorSmartphone className="h-3.5 w-3.5 shrink-0" />
                {t("activity.network", {
                  ip: item.ip_address || t("fallbacks.unknown"),
                  agent: item.user_agent || t("fallbacks.unknown"),
                })}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    ) : (
      <p className="rounded-lg border border-dashed border-border bg-background-secondary/50 p-4 text-sm text-text-secondary">
        {t(emptyKey)}
      </p>
    )
  }

  const showActivity = logs === "both" || logs === "activity"
  const showAudit = logs === "both" || logs === "audit"

  return (
    <div className={showActivity && showAudit ? "grid gap-6 xl:grid-cols-2" : "space-y-6"}>
      {showActivity ? (
        <SectionCard icon={Activity} title={t("activity.title")}>
          {renderItems(user.activity_logs, "activity.empty")}
        </SectionCard>
      ) : null}
      {showAudit ? (
        <SectionCard icon={ClipboardList} title={t("activity.auditTitle")}>
          {renderItems(user.audit_logs, "activity.auditEmpty")}
        </SectionCard>
      ) : null}
    </div>
  )
}

function UnavailableNotice() {
  const { t } = useTranslation("adminUsers")
  return (
    <p className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
      {t("details.backendCoverageWarning")}
    </p>
  )
}
