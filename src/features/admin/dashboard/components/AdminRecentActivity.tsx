import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  FlaskConical,
  UserRound,
} from "lucide-react"

import type { ActivityItem } from "../types/adminDashboard.types"
import DashboardPanel from "./DashboardPanel"
import { useTranslation } from "react-i18next"

function formatDate(value: string | undefined, locale: string, fallback: string): string {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export default function AdminRecentActivity({ items }: { items: ActivityItem[] }) {
  const { t, i18n } = useTranslation("adminDashboard")
  return (
    <DashboardPanel
      title={t("recentTitle")}
      subtitle={t("recentSubtitle")}
    >
      {items.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center text-sm text-text-muted">
          {t("noRecent")}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => {
            const Icon =
              item.type === "company"
                ? Building2
                : item.type === "job"
                  ? BriefcaseBusiness
                  : item.type === "application"
                    ? ClipboardList
                    : item.type === "test"
                      ? FlaskConical
                      : UserRound
            return (
              <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
                  <p className="truncate text-xs text-text-muted">{item.description}</p>
                </div>
                <time className="hidden text-xs text-text-muted sm:block">
                  {formatDate(item.timestamp, i18n.language, t("dateUnavailable"))}
                </time>
              </div>
            )
          })}
        </div>
      )}
    </DashboardPanel>
  )
}
