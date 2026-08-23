import { Activity, CalendarClock, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import type { AdminCompanyDetails } from "../types/adminCompanies.types"

export default function AdminCompanyActivityPanel({ company }: { company: AdminCompanyDetails }) {
  const { t, i18n } = useTranslation("adminCompanies")

  const formatDate = (value?: string | null) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(date)
  }

  return (
    <SectionCard icon={Activity} title={t("activity.title")}>
      <div className="space-y-3">
        {(company.recent_activity?.length ?? 0) > 0 ? (
          company.recent_activity?.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-text-primary">{activity.message}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                    {activity.actor_name ? (
                      <span className="inline-flex items-center gap-1">
                        <UserRound className="h-3.5 w-3.5" />
                        {activity.actor_name}
                      </span>
                    ) : null}
                    {formatDate(activity.created_at) ? (
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {formatDate(activity.created_at)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <StatusBadge status={activity.type} variant="soft" />
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={t("activity.empty")}
            description={t("activity.empty")}
            className="rounded-2xl border border-dashed border-border bg-background-secondary/50 p-4"
          />
        )}
      </div>
    </SectionCard>
  )
}
