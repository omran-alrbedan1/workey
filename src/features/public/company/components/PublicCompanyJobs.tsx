import { MapPin, Clock, DollarSign, Briefcase, ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import EmptyState from "@/components/shared/states/EmptyState"
import type { PublicCompanyJob } from "../types/publicCompany.types"

interface PublicCompanyJobsProps {
  jobs: PublicCompanyJob[]
  isLoading?: boolean
}

export default function PublicCompanyJobs({ jobs, isLoading }: PublicCompanyJobsProps) {
  const { t } = useTranslation("publicCompany")

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <EmptyState
        title={t("noJobs")}
        description={t("noJobs")}
        className="rounded-lg border border-dashed border-border p-8"
      />
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="rounded-lg border border-border bg-background-card p-4 shadow-card transition hover:border-primary/40"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-text-primary">{job.title}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted">
                {job.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.employment_type && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{job.employment_type}</span>
                  </div>
                )}
                {job.experience_level && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{job.experience_level}</span>
                  </div>
                )}
                {job.salary_min && job.salary_max && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>
                      {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}{" "}
                      {job.salary_currency}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.is_remote && (
                  <Badge variant="secondary" className="text-xs">
                    {t("remote")}
                  </Badge>
                )}
                {job.is_active && (
                  <Badge variant="default" className="text-xs">
                    {t("active")}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/jobs/${job.slug}`} className="inline-flex items-center gap-1">
                {t("viewJob")}
                <ArrowUpRight className="h-3.5 w-3.5 rtl:-rotate-90" />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}


