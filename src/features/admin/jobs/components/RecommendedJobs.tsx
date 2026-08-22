import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  Building2,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { jobRecommendationsService } from "../services/jobRecommendations.service"
import type { RecommendedJob } from "../types/jobRecommendations.types"
import { useQuery } from "@tanstack/react-query"

interface RecommendedJobsProps {
  candidateId?: string | number
  limit?: number
}

export default function RecommendedJobs({ candidateId, limit = 10 }: RecommendedJobsProps) {
  const { t } = useTranslation("adminJobs")
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommended-jobs", candidateId, limit],
    queryFn: () =>
      jobRecommendationsService.getRecommendedJobs({ candidateId: candidateId!, per_page: limit }),
    enabled: !!candidateId,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex min-h-32 items-center justify-center text-sm text-text-muted">
        {t("noRecommendations")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.data.map((job: RecommendedJob) => (
        <div
          key={job.id}
          className="rounded-lg border border-border bg-background-card p-4 shadow-card transition hover:border-primary/40"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-text-primary">{job.title}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{job.company.name}</span>
                  </div>
                </div>
                {job.match_score !== undefined && (
                  <div className="flex shrink-0 items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {Math.round(job.match_score * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted">
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

              {job.match_reasons && job.match_reasons.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-text-muted">{t("matchReasons")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.match_reasons.slice(0, 3).map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {job.is_remote && (
                  <Badge variant="secondary" className="text-xs">
                    {t("remote")}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/admin/jobs/${job.id}`} className="inline-flex items-center gap-1">
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
