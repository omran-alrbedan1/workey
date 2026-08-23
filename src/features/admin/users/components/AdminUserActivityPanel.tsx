import { Activity, ClipboardList, MonitorSmartphone } from "lucide-react"
import { useTranslation } from "react-i18next"

import { LoadingState } from "@/components/shared/states"
import EmptyState from "@/components/shared/states/EmptyState"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import { valueOf } from "@/lib/keyValue"

import { useAdminUserActivity, useAdminUserAuditLogs } from "../hooks/useAdminUserRelated"

export type AdminUserActivityLogsVariant = "both" | "activity" | "audit"

interface AdminUserActivityPanelProps {
  userId?: string
  logs?: AdminUserActivityLogsVariant
}

export default function AdminUserActivityPanel({
  userId,
  logs = "activity",
}: AdminUserActivityPanelProps) {
  const { t, i18n } = useTranslation("adminUsers")
  const locale = i18n.resolvedLanguage
  const formatDate = (input?: string | null) => {
    if (!input) return t("fallbacks.noDate")
    const date = new Date(input)
    return Number.isNaN(date.getTime())
      ? input
      : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date)
  }
  // Backend sends machine keys such as "cv.parsing_completed"; translate the
  // known ones and humanize anything new instead of printing the raw key.
  const formatEventKey = (key: string) =>
    t(`activity.events.${key.replace(/\./g, "_")}`, {
      defaultValue: key.replace(/[._]+/g, " "),
    })

  const showActivity = logs === "both" || logs === "activity"
  const showAudit = logs === "both" || logs === "audit"

  // Backend exposes the merged audit+notification timeline and the raw audit
  // log through two endpoints; both are needed for the combined view.
  const activityQuery = useAdminUserActivity(userId, { enabled: true })
  const auditQuery = useAdminUserAuditLogs(userId, { enabled: showAudit })

  const renderActivityItems = () => {
    if (activityQuery.isPending) return <LoadingState size="sm" />
    const items = activityQuery.data?.items ?? []
    if (!items.length) {
      return (
        <EmptyState
          title={t("activity.empty")}
          description={t("activity.title")}
          icon={Activity}
          className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
        />
      )
    }
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-border bg-background-secondary/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-medium text-text-primary">{formatEventKey(item.event_key)}</p>
              {item.source ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {t(`activity.sources.${item.source}`, { defaultValue: item.source })}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-text-muted">{formatDate(item.occurred_at)}</p>
          </article>
        ))}
      </div>
    )
  }

  const renderAuditItems = () => {
    if (auditQuery.isPending) return <LoadingState size="sm" />
    const items = auditQuery.data?.items ?? []
    if (!items.length) {
      return (
        <EmptyState
          title={t("activity.auditEmpty")}
          description={t("activity.auditTitle")}
          icon={ClipboardList}
          className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-8"
        />
      )
    }
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-border bg-background-secondary/60 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-text-primary">{formatEventKey(item.action)}</p>
              {valueOf(item.entity) ? (
                <p className="mt-1 text-sm text-text-secondary">{valueOf(item.entity)}</p>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-text-muted">
              {t("activity.meta", {
                actor: item.actor?.name || t("fallbacks.system"),
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
    )
  }

  return (
    <div className={showActivity && showAudit ? "grid gap-6 xl:grid-cols-2" : "space-y-6"}>
      {showActivity ? (
        <SectionCard icon={Activity} title={t("activity.title")}>
          {renderActivityItems()}
        </SectionCard>
      ) : null}
      {showAudit ? (
        <SectionCard icon={ClipboardList} title={t("activity.auditTitle")}>
          {renderAuditItems()}
        </SectionCard>
      ) : null}
    </div>
  )
}
