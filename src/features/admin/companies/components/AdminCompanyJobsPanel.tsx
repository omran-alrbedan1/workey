import { useQuery } from "@tanstack/react-query"
import { BriefcaseBusiness, CalendarClock, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"
import { Skeleton } from "@/components/ui/skeleton"
import { adminJobsService } from "@/features/admin/jobs/services/adminJobs.service"

interface AdminCompanyJobsPanelProps {
  companyId: string | number
}

export default function AdminCompanyJobsPanel({ companyId }: AdminCompanyJobsPanelProps) {
  const { t, i18n } = useTranslation("adminCompanies")
  const jobs = useQuery({
    queryKey: ["admin", "companies", String(companyId), "jobs"],
    queryFn: () =>
      adminJobsService.list({
        company: String(companyId),
        page: 1,
        per_page: 10,
        sort_by: "created_at",
        sort_direction: "desc",
      }),
    retry: false,
  })

  const formatDate = (value?: string | null) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(i18n.resolvedLanguage).format(date)
  }

  if (jobs.isPending) {
    return (
      <SectionCard icon={BriefcaseBusiness} title={t("jobs.title")}>
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </SectionCard>
    )
  }

  if (jobs.isError) {
    return (
      <SectionCard icon={BriefcaseBusiness} title={t("jobs.title")}>
        <p className="rounded-2xl border border-border bg-background-secondary/50 p-4 text-sm text-text-secondary">
          {t("jobs.error")}
        </p>
      </SectionCard>
    )
  }

  return (
    <SectionCard icon={BriefcaseBusiness} title={t("jobs.title")}>
      <div className="space-y-3">
        {jobs.data.items.length > 0 ? (
          jobs.data.items.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background-secondary/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-text-primary">{job.title}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-muted">
                  {job.applications_count !== undefined ? (
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {t("jobs.applications", { count: job.applications_count })}
                    </span>
                  ) : null}
                  {formatDate(job.created_at) ? (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {t("jobs.created", { date: formatDate(job.created_at) })}
                    </span>
                  ) : null}
                </div>
              </div>
              <StatusBadge status={job.status} variant="soft" />
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-background-secondary/50 p-4 text-sm text-text-secondary">
            {t("jobs.empty")}
          </p>
        )}
      </div>
    </SectionCard>
  )
}
