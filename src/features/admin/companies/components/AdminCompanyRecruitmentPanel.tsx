import { Activity, BriefcaseBusiness, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { MetricStatusCard } from "@/components/shared/cards/MetricCard"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminCompanyDetails } from "../types/adminCompanies.types"

export default function AdminCompanyRecruitmentPanel({
  company,
}: {
  company: AdminCompanyDetails
}) {
  const { t, i18n } = useTranslation("adminCompanies")
  const formatDate = (value?: string | null) => {
    if (!value) return t("fallbacks.noDate")
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(i18n.resolvedLanguage).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricStatusCard
          title={t("recruitment.activeJobs")}
          value={company.active_jobs_count ?? 0}
          icon={BriefcaseBusiness}
        />
        <MetricStatusCard
          title={t("recruitment.totalJobs")}
          value={company.total_jobs_count ?? 0}
          icon={FileText}
        />
        <MetricStatusCard
          title={t("recruitment.applications")}
          value={company.total_applications_count ?? 0}
          icon={Activity}
        />
        <MetricStatusCard
          title={t("recruitment.profileCompletion")}
          value={company.profile_completion ?? 0}
          suffix="%"
          icon={Activity}
        />
      </div>

      <SectionCard icon={BriefcaseBusiness} title={t("recruitment.recentJobs")}>
        <div className="space-y-3">
          {(company.recent_jobs?.length ?? 0) > 0 ? (
            company.recent_jobs?.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background-secondary/60 p-4"
              >
                <div>
                  <p className="font-medium text-text-primary">{job.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {t("recruitment.jobMeta", {
                      count: job.applications_count ?? 0,
                      date: formatDate(job.created_at),
                    })}
                  </p>
                </div>
                <StatusBadge status={job.status} variant="soft" />
              </div>
            ))
          ) : (
            <EmptyState
              title={t("recruitment.jobsUnavailable")}
              description={t("recruitment.jobsUnavailable")}
              className="rounded-2xl border border-dashed border-border bg-background-secondary/50 p-4"
            />
          )}
        </div>
      </SectionCard>

      <SectionCard icon={Activity} title={t("recruitment.recentActivity")}>
        <div className="space-y-3">
          {(company.recent_activity?.length ?? 0) > 0 ? (
            company.recent_activity?.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border border-border bg-background-secondary/60 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-text-primary">{activity.message}</p>
                  <StatusBadge status={activity.type} variant="soft" />
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {t("recruitment.activityMeta", {
                    actor: activity.actor_name || t("fallbacks.system"),
                    date: formatDate(activity.created_at),
                  })}
                </p>
              </div>
            ))
          ) : (
            <EmptyState
              title={t("recruitment.activityUnavailable")}
              description={t("recruitment.activityUnavailable")}
              className="rounded-2xl border border-dashed border-border bg-background-secondary/50 p-4"
            />
          )}
        </div>
      </SectionCard>
    </div>
  )
}



