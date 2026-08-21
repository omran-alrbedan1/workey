import {
  Activity,
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarPlus,
  Clock,
  FileText,
  IdCard,
  Link,
  Mail,
  MailQuestion,
  MapPin,
  Phone,
  SlidersHorizontal,
  UserRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { ComponentType, ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { valueOf } from "@/lib/keyValue"
import { candidateHeadline } from "../../utils/candidateDisplay"
import { getAllowedApplicationActions } from "../../utils/applicationActions"
import type { ApplicationStatusKey, EmployerApplicantDetail } from "../../types/employerApplicants.types"
import {
  InfoItem,
  SectionCard,
  SkillGroup,
  formatDate,
  formatSalary,
} from "./section-ui"

interface OverviewSectionProps {
  application: EmployerApplicantDetail
  candidateName: string
  isStatusPending: boolean
  onOpenStatusDialog: (target: ApplicationStatusKey) => void
  onScheduleInterview: () => void
  onRequestInformation: () => void
}

export default function OverviewSection({
  application,
  candidateName,
  isStatusPending,
  onOpenStatusDialog,
  onScheduleInterview,
  onRequestInformation,
}: OverviewSectionProps) {
  const { t } = useTranslation(["employerApplicants", "common"])
  const profile = application.submitted_snapshot?.profile
  const job = application.job_posting
  const latestStatus = application.status_history?.[application.status_history.length - 1]
  const matchScore = application.match_score ?? application.matching_score
  const allowedActions = getAllowedApplicationActions(application)

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-border bg-background-card shadow-card">
        <div className="border-b border-border bg-muted/30 px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary text-2xl font-bold text-white shadow-sm ring-4 ring-background">
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold leading-tight text-text-primary">{candidateName}</h2>
                  <Badge variant="secondary" className="text-xs text-white">
                    {String(valueOf(application.status, "applied"))}
                  </Badge>
                </div>
                {(candidateHeadline(application) || profile?.identity?.email) && (
                  <p className="mt-1 max-w-2xl text-sm text-text-muted">
                    {candidateHeadline(application) || profile?.identity?.email || ""}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                  {profile?.identity?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {profile.identity.email}
                    </span>
                  )}
                  {profile?.identity?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {profile.identity.phone}
                    </span>
                  )}
                  {(profile?.location?.city || profile?.location?.full_address || profile?.location?.location_text) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.location.city || profile.location.full_address || profile.location.location_text}
                    </span>
                  )}
                </div>
                {(profile?.professional?.linkedin_url ||
                  profile?.professional?.github_url ||
                  profile?.professional?.portfolio_url) && (
                  <div className="mt-3 flex items-center gap-2">
                    {profile?.professional?.linkedin_url && (
                      <OverviewLinkChip href={profile.professional.linkedin_url} label={t("common:profileLinks.linkedin")} />
                    )}
                    {profile?.professional?.github_url && (
                      <OverviewLinkChip href={profile.professional.github_url} label={t("common:profileLinks.github")} />
                    )}
                    {profile?.professional?.portfolio_url && (
                      <OverviewLinkChip href={profile.professional.portfolio_url} label={t("common:profileLinks.portfolio")} />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 rounded-lg border border-border bg-background-card p-4">
              <ApplicationScoreChip matchScore={matchScore} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryTile icon={IdCard} label={t("candidate.applicationId")} value={`#${application.id}`} />
          <SummaryTile icon={Briefcase} label={t("candidate.position")} value={application.job_posting?.title ?? "-"} />
          <SummaryTile
            icon={Calendar}
            label={t("columns.applied")}
            value={formatDate(application.applied_at ?? application.created_at)}
          />
          <SummaryTile
            icon={Activity}
            label={t("candidate.latestStatus")}
            value={String(valueOf(latestStatus?.to_status, valueOf(application.status, "-")))}
          />
        </div>
      </section>

      <ActionPanel
        application={application}
        allowedActions={allowedActions}
        isStatusPending={isStatusPending}
        onOpenStatusDialog={onOpenStatusDialog}
        onScheduleInterview={onScheduleInterview}
        onRequestInformation={onRequestInformation}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title={t("candidate.applicationTitle")} icon={FileText}>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label={t("columns.status")} value={String(valueOf(application.status, "-"))} />
            <InfoItem label={t("candidate.lastUpdated")} value={formatDate(application.created_at)} />
            <InfoItem label={t("candidate.snapshotStatus")} value={String(valueOf(application.snapshot_status, "-"))} />
            <InfoItem
              label={t("candidate.profileConsent")}
              value={application.consent_to_share_profile ? t("answers.yes") : t("answers.no")}
            />
          </div>
        </SectionCard>

        <SectionCard title={t("candidate.latestActivity")} icon={Clock}>
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoItem
              label={t("candidate.latestStatus")}
              value={String(valueOf(latestStatus?.to_status, valueOf(application.status, "-")))}
            />
            <InfoItem label={t("candidate.changedBy")} value={latestStatus?.changed_by?.name ?? "-"} />
            <InfoItem label={t("candidate.changedAt")} value={formatDate(latestStatus?.changed_at)} />
          </div>
          {latestStatus?.note && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-text-muted">{t("interview.notes")}</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{latestStatus.note}</p>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title={t("candidate.jobTitle")} icon={Briefcase}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label={t("candidate.position")} value={job?.title ?? "-"} />
          <InfoItem label={t("candidate.department")} value={job?.department ?? "-"} />
          <InfoItem label={t("candidate.employmentType")} value={String(valueOf(job?.employment_type, "-"))} />
          <InfoItem label={t("candidate.experienceLevel")} value={String(valueOf(job?.experience_level, "-"))} />
          <InfoItem label={t("candidate.educationLevel")} value={String(valueOf(job?.education_level, "-"))} />
          <InfoItem label={t("candidate.workMode")} value={String(valueOf(job?.work_mode, "-"))} />
          <InfoItem label={t("candidate.location")} value={job?.city || job?.location || "-"} />
          <InfoItem label={t("candidate.salary")} value={formatSalary(job?.salary_min, job?.salary_max)} />
        </div>

        {((job?.required_skills?.length ?? 0) > 0 || (job?.nice_to_have_skills?.length ?? 0) > 0) && (
          <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <SkillGroup title={t("candidate.requiredSkills")} skills={job?.required_skills ?? []} />
            <SkillGroup title={t("candidate.niceSkills")} skills={job?.nice_to_have_skills ?? []} />
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function ApplicationScoreChip({ matchScore }: { matchScore: number | null | undefined }) {
  const { t } = useTranslation("employerApplicants")

  if (matchScore == null) {
    return (
      <p className="px-3 py-2 text-center text-xs text-text-muted">{t("matching.unavailableShort")}</p>
    )
  }

  const percent = matchScore <= 1 ? Math.round(matchScore * 100) : Math.round(matchScore)

  return (
    <div
      className={cn(
        "rounded-md px-3 py-2 text-center text-sm font-semibold",
        percent >= 70
          ? "bg-emerald-100 text-emerald-700"
          : percent >= 40
            ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700",
      )}
    >
      {percent}% {t("columns.match")}
    </div>
  )
}

function ActionPanel({
  application,
  allowedActions,
  isStatusPending,
  onOpenStatusDialog,
  onScheduleInterview,
  onRequestInformation,
}: {
  application: EmployerApplicantDetail
  allowedActions: ReturnType<typeof getAllowedApplicationActions>
  isStatusPending: boolean
  onOpenStatusDialog: (target: ApplicationStatusKey) => void
  onScheduleInterview: () => void
  onRequestInformation: () => void
}) {
  const { t } = useTranslation("employerApplicants")
  const hasAnyAction = allowedActions.statusTargets.length > 0 || allowedActions.flows.length > 0

  return (
    <section className="rounded-xl border border-border bg-background-card p-5 shadow-card">
      <h3 className="mb-1 flex items-center gap-3 text-sm font-semibold text-text-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <SlidersHorizontal className="h-4 w-4" />
        </span>
        <span>{t("overview.actionsTitle")}</span>
      </h3>
      <p className="mb-4 text-xs text-text-muted">
        {allowedActions.source === "allowed_actions"
          ? t("overview.actionsFromApiHint")
          : t("overview.actionsFallbackHint")}
      </p>

      {!hasAnyAction ? (
        <p className="rounded-lg border border-dashed border-border bg-background/50 p-4 text-center text-sm text-text-muted">
          {t("overview.noActions")}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {allowedActions.statusTargets.map((status) => (
            <Button
              key={`status-${status}`}
              variant={statusActionButtonVariant(status)}
              size="sm"
              disabled={isStatusPending}
              onClick={() => onOpenStatusDialog(status)}
            >
              {status === "accepted" || status === "rejected" ? null : <ArrowRight className="h-4 w-4" />}
              {t(`statuses.${status}`)}
            </Button>
          ))}
          {allowedActions.flows.includes("schedule_interview") && (
            <Button variant="outline" size="sm" disabled={isStatusPending} onClick={onScheduleInterview}>
              <CalendarPlus className="h-4 w-4" />
              {t("actions.scheduleInterview")}
            </Button>
          )}
          {allowedActions.flows.includes("request_information") && (
            <Button variant="outline" size="sm" disabled={isStatusPending} onClick={onRequestInformation}>
              <MailQuestion className="h-4 w-4" />
              {t("actions.requestInformation")}
            </Button>
          )}
          <span className="ms-auto hidden items-center gap-1.5 text-xs text-text-muted sm:flex">
            <UserRound className="h-3.5 w-3.5" />
            {application.id ? `#${application.id}` : ""}
          </span>
        </div>
      )}
    </section>
  )
}

function statusActionButtonVariant(status: ApplicationStatusKey): "default" | "destructive" | "outline" {
  if (status === "rejected") return "destructive"
  if (status === "accepted" || status === "shortlisted") return "default"
  return "outline"
}

function OverviewLinkChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
      aria-label={label}
    >
      <Link className="h-4 w-4" />
    </a>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-background p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-text-primary">{value || "-"}</p>
      </div>
    </div>
  )
}
