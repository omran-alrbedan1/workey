import {
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
  Wrench,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { keyOf, valueOf } from "@/lib/keyValue"
import { cn } from "@/lib/utils"
import EmptyState from "@/components/shared/states/EmptyState"
import type { EmployerJob } from "../types/employerJobs.types"

interface EmployerJobOverviewProps {
  job: EmployerJob
}

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

export default function EmployerJobOverview({ job }: EmployerJobOverviewProps) {
  const { t } = useTranslation("employerJobs")

  return (
    <div className="space-y-6">
      {/* Job Info Card */}
      <Card className="overflow-hidden border-border bg-background-card shadow-card">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 via-primary/[0.02] to-transparent pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-sm">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{job.title}</h2>
                <p className="text-sm text-text-muted">{job.department || t("fields.title")}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                getKey(job.status) === "published" || getKey(job.status) === "open"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : getKey(job.status) === "draft"
                    ? "bg-gray-100 text-gray-700 border-gray-200"
                    : getKey(job.status) === "closed"
                      ? "bg-rose-100 text-rose-800 border-rose-200"
                      : "bg-blue-100 text-blue-800 border-blue-200",
              )}
            >
              {getValue(job.status) || "draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {job.department && (
            <div className="mb-4 rounded-lg border border-border bg-background/50 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Building2 className="h-4 w-4 text-primary" />
                {t("fields.department")}: {job.department}
              </p>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow
              icon={Building2}
              label={t("fields.employmentType")}
              value={getValue(job.employment_type) || "-"}
            />
            <InfoRow
              icon={GraduationCap}
              label={t("fields.experienceLevel")}
              value={getValue(job.experience_level) || "-"}
            />
            <InfoRow
              icon={MapPin}
              label={t("fields.workMode")}
              value={getValue(job.work_mode) || "-"}
            />
            <InfoRow
              icon={MapPin}
              label={t("fields.location")}
              value={job.location || "-"}
            />
          </div>

          {(job.salary_min != null || job.salary_max != null) && (
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
                    {job.salary_min != null ? `${Number(job.salary_min).toLocaleString()}` : "—"}
                    {" - "}
                    {job.salary_max != null ? `${Number(job.salary_max).toLocaleString()}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-text-muted">
            {job.created_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>
                  {t("columns.created")}: {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
            {job.application_deadline && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>
                  {t("fields.applicationDeadline")}: {new Date(job.application_deadline).toLocaleDateString()}
                </span>
              </div>
            )}
            {job.applications_count != null && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span>{job.applications_count} applicants</span>
              </div>
            )}
          </div>

          {job.description && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <FileText className="h-4 w-4 text-primary" />
                {t("fields.description")}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {job.description}
              </p>
            </div>
          )}

          {job.responsibilities && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <ListChecks className="h-4 w-4 text-primary" />
                {t("fields.responsibilities")}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {job.responsibilities}
              </p>
            </div>
          )}
          {job.benefits && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Gift className="h-4 w-4 text-primary" />
                {t("fields.benefits")}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {job.benefits}
              </p>
            </div>
          )}
          {job.requirements && (
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Target className="h-4 w-4 text-primary" />
                {t("fields.requirements")}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {job.requirements}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Card */}
      {job.skills && job.skills.length > 0 ? (
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
              {job.skills.map((skill) => (
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
      ) : (
        <EmptyState
          title={t("skills.emptyTitle")}
          description={t("skills.emptyDescription")}
          icon={Wrench}
        />
      )}
    </div>
  )
}
