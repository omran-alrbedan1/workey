import {
  Activity,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Link,
  Sparkles,
  UserRound,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { valueOf } from "@/lib/keyValue"
import { candidateHeadline } from "../../utils/candidateDisplay"
import { getApplicationStatusActions } from "../../utils/statusActions"
import type { ApplicationCvDocument } from "../../utils/cv"
import ApplicationStatusHistory from "../ApplicationStatusHistory"
import type {
  ApplicationStatusKey,
  ApplicationSnapshotProfile,
  EmployerApplicantDetail,
} from "../../types/employerApplicants.types"

interface CandidateInfoTabProps {
  application: EmployerApplicantDetail
  candidateName: string
  cvDocument: ApplicationCvDocument | null
  isCvBusy: boolean
  onStatusChange: (status: ApplicationStatusKey) => void
  onPreviewCv: () => void
  onDownloadCv: () => void
  isStatusPending: boolean
}

export default function CandidateInfoTab({
  application,
  candidateName,
  cvDocument,
  isCvBusy,
  onStatusChange,
  onPreviewCv,
  onDownloadCv,
  isStatusPending,
}: CandidateInfoTabProps) {
  const { t, i18n } = useTranslation(["employerApplicants", "common"])
  const profile = application.submitted_snapshot?.profile
  const job = application.job_posting
  const requiredSkills = job?.required_skills ?? []
  const niceSkills = job?.nice_to_have_skills ?? []
  const latestStatus = application.status_history?.[application.status_history.length - 1]
  const matchScore = application.match_score ?? application.matching_score
  const statusActions = getApplicationStatusActions(application)
  const nextStatuses = statusActions.targets

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
                <div className="mt-3 flex items-center gap-2">
                  {profile?.professional?.linkedin_url && (
                    <ProfileLink href={profile.professional.linkedin_url} label={t("common:profileLinks.linkedin")} />
                  )}
                  {profile?.professional?.github_url && (
                    <ProfileLink href={profile.professional.github_url} label={t("common:profileLinks.github")} />
                  )}
                  {profile?.professional?.portfolio_url && (
                    <ProfileLink href={profile.professional.portfolio_url} label={t("common:profileLinks.portfolio")} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 rounded-lg border border-border bg-background-card p-4">
              {matchScore != null && (
                <div className={cn(
                  "rounded-md px-3 py-2 text-center text-sm font-semibold",
                  matchScore >= 70 ? "bg-emerald-100 text-emerald-700" :
                  matchScore >= 40 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {matchScore <= 1
                    ? Math.round(matchScore * 100)
                    : Math.round(matchScore)}% {t("columns.match")}
                </div>
              )}
              {nextStatuses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-text-muted">{t("actions.changeStatus")}</span>
                  <Select
                    value=""
                    onValueChange={(value) => onStatusChange(value as ApplicationStatusKey)}
                    disabled={isStatusPending}
                  >
                    <SelectTrigger className="w-full min-w-52 bg-background">
                      <SelectValue placeholder={t("actions.changeStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      {nextStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`statuses.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryTile icon={IdCard} label={t("candidate.applicationId")} value={`#${application.id}`} />
          <SummaryTile
            icon={Briefcase}
            label={t("candidate.position")}
            value={application.job_posting?.title ?? "-"}
          />
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

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title={t("candidate.applicationTitle")} icon={FileText}>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label={t("columns.status")} value={String(valueOf(application.status, "-"))} />
            <InfoItem label={t("candidate.lastUpdated")} value={formatDate(application.created_at)} />
            <InfoItem label={t("candidate.snapshotStatus")} value={String(valueOf(application.snapshot_status, "-"))} />
            <InfoItem
              label={t("candidate.profileConsent")}
              value={application.consent_to_share_profile ? t("answers.yes") : t("answers.no")}
            />
          </div>
        </InfoCard>

        <InfoCard title={t("candidate.latestActivity")} icon={Clock}>
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoItem label={t("candidate.latestStatus")} value={String(valueOf(latestStatus?.to_status, valueOf(application.status, "-")))} />
            <InfoItem label={t("candidate.changedBy")} value={latestStatus?.changed_by?.name ?? "-"} />
            <InfoItem label={t("candidate.changedAt")} value={formatDate(latestStatus?.changed_at)} />
          </div>
          {latestStatus?.note && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-text-muted">{t("interview.notes")}</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{latestStatus.note}</p>
            </div>
          )}
        </InfoCard>
      </div>

      <InfoCard title={t("candidate.jobTitle")} icon={Briefcase}>
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

        {(requiredSkills.length > 0 || niceSkills.length > 0) && (
          <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <SkillGroup title={t("candidate.requiredSkills")} skills={requiredSkills} />
            <SkillGroup title={t("candidate.niceSkills")} skills={niceSkills} />
          </div>
        )}
      </InfoCard>

      {profile && (
        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title={t("candidate.profileTitle")} icon={UserRound}>
            <InfoItem
              label={t("candidate.summary")}
              value={profile.identity?.summary ?? profile.professional?.summary ?? "-"}
            />
            <InfoItem label={t("candidate.availability")} value={profile.availability?.status ?? "-"} />
          </InfoCard>

          <InfoCard title={t("candidate.linksTitle")} icon={Sparkles}>
            <ProfileLinkItems profile={profile} />
          </InfoCard>

          {(profile.skills?.length ?? 0) > 0 && (
            <InfoCard title={t("candidate.skillsTitle")} icon={Award} className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                {profile.skills!.map((skill, index) => (
                  <Badge key={`${skill.slug ?? skill.name ?? index}-${index}`} variant="secondary">
                    {skill.name || skill.slug || "-"}
                  </Badge>
                ))}
              </div>
            </InfoCard>
          )}
        </div>
      )}

      {(profile?.experiences?.length ?? 0) > 0 && (
        <InfoCard title={t("candidate.experiencesTitle")} icon={Building2}>
          <div className="space-y-3">
            {profile!.experiences!.map((experience, index) => (
              <TimelineItem
                key={`${experience.title ?? "experience"}-${index}`}
                title={experience.title || "-"}
                subtitle={experience.company}
                meta={formatPeriod(experience.start_date, experience.end_date, experience.is_current, i18n.language, t("candidate.present"))}
                description={experience.description}
              />
            ))}
          </div>
        </InfoCard>
      )}

      {(profile?.education?.length ?? 0) > 0 && (
        <InfoCard title={t("candidate.educationTitle")} icon={GraduationCap}>
          <div className="space-y-3">
            {profile!.education!.map((education, index) => (
              <TimelineItem
                key={`${education.degree ?? "education"}-${index}`}
                title={education.degree || "-"}
                subtitle={
                  [education.institution, education.field_of_study].filter(Boolean).join(" · ") || undefined
                }
                meta={formatPeriod(education.start_date, education.end_date, education.is_current, i18n.language, t("candidate.present"))}
              />
            ))}
          </div>
        </InfoCard>
      )}

      {cvDocument && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background-card p-5 shadow-card">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Paperclip className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary">{t("candidate.documentsTitle")}</h3>
              <p className="truncate text-xs text-text-muted" title={cvDocument.name}>
                {cvDocument.name}
              </p>
              <p className="text-xs text-text-muted">{t("candidate.cvSupplementaryHint")}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {cvDocument.canPreview && (
              <Button variant="outline" size="sm" disabled={isCvBusy} onClick={onPreviewCv}>
                <Eye className="h-4 w-4" /> {t("candidate.previewCv")}
              </Button>
            )}
            {cvDocument.canDownload && (
              <Button variant="outline" size="sm" disabled={isCvBusy} onClick={onDownloadCv}>
                <Download className="h-4 w-4" /> {t("candidate.downloadCv")}
              </Button>
            )}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-background-card p-5 shadow-card">
        <ApplicationStatusHistory history={application.status_history ?? []} />
      </section>
    </div>
  )
}

function ProfileLink({ href, label }: { href: string; label: string }) {
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

function InfoCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-background-card p-5 shadow-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold text-text-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span>{title}</span>
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function ProfileLinkItems({ profile }: { profile: ApplicationSnapshotProfile }) {
  const { t } = useTranslation(["employerApplicants", "common"])

  const namedLinks = [
    { label: t("common:profileLinks.linkedin"), url: profile.professional?.linkedin_url },
    { label: t("common:profileLinks.github"), url: profile.professional?.github_url },
    { label: t("common:profileLinks.portfolio"), url: profile.professional?.portfolio_url },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url))

  const extraLinks = [
    ...(profile.professional_links ?? []),
    ...(profile.professional?.other_links ?? []),
  ]
    .filter((link): link is { label?: string; url: string } => Boolean(link.url))
    .map((link) => ({ label: link.label?.trim() || hostOf(link.url), url: link.url }))

  const links = [...namedLinks, ...extraLinks]
  if (links.length === 0) {
    return <p className="text-sm text-text-muted">-</p>
  }

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Link className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{link.label}</span>
        </a>
      ))}
    </div>
  )
}

function TimelineItem({
  title,
  subtitle,
  meta,
  description,
}: {
  title: string
  subtitle?: string | null
  meta?: string | null
  description?: string | null
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {meta && <span className="text-xs font-medium text-text-muted">{meta}</span>}
      </div>
      {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
      {description && (
        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-text-muted">{description}</p>
      )}
    </div>
  )
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function formatPeriod(
  start?: string | null,
  end?: string | null,
  isCurrent?: boolean,
  language?: string,
  presentLabel = "Present",
) {
  const format = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString(language, { year: "numeric", month: "short" }) : null
  const from = format(start)
  const to = isCurrent ? presentLabel : format(end)
  if (!from && !to) return undefined
  return [from, to].filter(Boolean).join(" – ")
}

function InfoItem({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-text-primary">{value || "-"}</p>
    </div>
  )
}

function SkillGroup({
  title,
  skills,
}: {
  title: string
  skills: NonNullable<EmployerApplicantDetail["job_posting"]["skills"]>
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.id ?? skill.slug ?? skill.name} variant="outline">
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function formatSalary(min?: string | number | null, max?: string | number | null) {
  if (!min && !max) return "-"
  if (min && max) return `${min} - ${max}`
  return String(min ?? max)
}
