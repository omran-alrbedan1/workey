import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Gift,
  GraduationCap,
  ListChecks,
  MapPin,
  Target,
  Trophy,
  Wrench,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/config"
import { keyOf, valueOf } from "@/lib/keyValue"
import { cn } from "@/lib/utils"
import { useEmployerJob } from "../hooks/useEmployerJob"
import { useRankedCandidates } from "../hooks/useRankedCandidates"
import EmployerJobRankedCandidates from "../components/EmployerJobRankedCandidates"

function getKey(v: unknown): string {
  return keyOf(v)
}

function getValue(v: unknown): string {
  return valueOf(v)
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg bg-background/50 p-3", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  )
}

export default function EmployerJobDetailsPage() {
  const { t } = useTranslation("employerJobs")
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useEmployerJob(id)
  const rankedCandidates = useRankedCandidates(id)

  if (job.isError) {
    return (
      <ErrorState
        title={t("errors.editTitle")}
        description={t("errors.editDescription")}
        retry={() => void job.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("detailsTitle")}
        description={t("detailsDescription")}
        icon={Briefcase}
        showBackButton
        backButtonLabel={t("actions.back")}
        onBackClick={() => navigate(ROUTES.employer.jobs)}
      />

      {job.isPending ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : job.data ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => id && navigate(ROUTES.employer.screeningQuestions(id))}
            >
              <ListChecks className="h-4 w-4" />
              {t("screeningQuestions.pageTitle")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => id && navigate(ROUTES.employer.rankedCandidates(id))}
            >
              <Trophy className="h-4 w-4" />
              {t("rankedCandidates.pageTitle")}
            </Button>
          </div>

          {/* Job Info Card */}
          <Card className="overflow-hidden border-border bg-background-card shadow-card">
            <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-sm">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{job.data.title}</h2>
                    <p className="text-sm text-text-muted">                  {job.data.department || t("fields.title")}</p>
                  </div>
                </div>
                <Badge
                  variant="soft"
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    getKey(job.data.status) === "published" || getKey(job.data.status) === "open"
                      ? "bg-emerald-100 text-emerald-800"
                      : getKey(job.data.status) === "draft"
                        ? "bg-gray-100 text-gray-700"
                        : getKey(job.data.status) === "closed"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800",
                  )}
                >
                  {getValue(job.data.status) || "draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {job.data.department && (
                <div className="mb-4 rounded-lg border border-border bg-background/50 p-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Building2 className="h-4 w-4 text-primary" />
                    {t("fields.department")}: {job.data.department}
                  </p>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoRow
                  icon={Building2}
                  label={t("fields.employmentType")}
                  value={getValue(job.data.employment_type) || "-"}
                />
                <InfoRow
                  icon={GraduationCap}
                  label={t("fields.experienceLevel")}
                  value={getValue(job.data.experience_level) || "-"}
                />
                <InfoRow
                  icon={MapPin}
                  label={t("fields.workMode")}
                  value={getValue(job.data.work_mode) || "-"}
                />
                <InfoRow
                  icon={MapPin}
                  label={t("fields.location")}
                  value={job.data.location || "-"}
                />
              </div>

              {(job.data.salary_min != null || job.data.salary_max != null) && (
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        {t("fields.salaryMin")} - {t("fields.salaryMax")}
                      </p>
                      <p className="text-lg font-bold text-text-primary">
                        {job.data.salary_min != null ? `${Number(job.data.salary_min).toLocaleString()}` : "—"}
                        {" - "}
                        {job.data.salary_max != null ? `${Number(job.data.salary_max).toLocaleString()}` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                {job.data.created_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {t("columns.created")}: {new Date(job.data.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.data.application_deadline && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {t("fields.applicationDeadline")}: {new Date(job.data.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.data.applications_count != null && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>{job.data.applications_count} applicants</span>
                  </div>
                )}
              </div>

              {job.data.description && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("fields.description")}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {job.data.description}
                  </p>
                </div>
              )}

              {job.data.responsibilities && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <ListChecks className="h-4 w-4 text-primary" />
                    {t("fields.responsibilities")}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {job.data.responsibilities}
                  </p>
                </div>
              )}
              {job.data.benefits && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Gift className="h-4 w-4 text-primary" />
                    {t("fields.benefits")}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {job.data.benefits}
                  </p>
                </div>
              )}
              {job.data.requirements && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Target className="h-4 w-4 text-primary" />
                    {t("fields.requirements")}
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {job.data.requirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Card */}
          {job.data.skills && job.data.skills.length > 0 && (
            <Card className="border-border bg-background-card shadow-card">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-text-primary">{t("skills.title")}</h2>
                    <p className="text-sm text-text-muted">{t("skills.description")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {job.data.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="gap-1.5 bg-primary/10 py-1.5 text-primary hover:bg-primary/20"
                    >
                      <Wrench className="h-3 w-3" />
                      {skill.name || `#${skill.id}`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Screening Questions Card (read-only) */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <Card className="border-border bg-background-card shadow-card">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-text-primary">{t("screeningQuestions.title")}</h2>
                    <p className="text-sm text-text-muted">{t("screeningQuestions.description")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-2">
                  {job.screeningQuestions.map((q) => (
                    <li
                      key={q.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">{q.question_text}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-text-muted">{t(`screeningQuestions.types.${getKey(q.question_type)}`)}</span>
                          {q.is_required && (
                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-700">
                              {t("screeningQuestions.required")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ranked Candidates - prominent section */}
          <Card className="overflow-hidden border-border bg-background-card shadow-card">
            <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{t("rankedCandidates.title")}</h2>
                  <p className="text-sm text-white/80">{t("rankedCandidates.description")}</p>
                </div>
                {rankedCandidates.data?.items && (
                  <div className="hidden items-center gap-3 sm:flex">
                    <div className="rounded-lg bg-white/15 px-4 py-2 text-center backdrop-blur-sm">
                      <p className="text-2xl font-bold text-white">{rankedCandidates.data.items.length}</p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Candidates</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <EmployerJobRankedCandidates
                candidates={rankedCandidates.data?.items ?? []}
                isLoading={rankedCandidates.isPending}
                isError={rankedCandidates.isError}
                onRetry={() => void rankedCandidates.refetch()}
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
