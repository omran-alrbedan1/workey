import {
  Activity,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  IdCard,
  Link,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ApplicationStatusKey, EmployerApplicantDetail } from "../../../types/employerApplicants.types"
import type { CandidateInfoModel } from "../../../hooks/useCandidateInfoTab"

interface CandidateInfoTabViewProps {
  model: CandidateInfoModel
  onStatusChange: (status: ApplicationStatusKey) => void
  isStatusPending: boolean
}

export default function CandidateInfoTabView({
  model,
  onStatusChange,
  isStatusPending,
}: CandidateInfoTabViewProps) {
  const { t } = useTranslation("employerApplicants")

  return (
    <div className="space-y-6">
      <CandidateHeader
        model={model}
        onStatusChange={onStatusChange}
        isStatusPending={isStatusPending}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ApplicationSummary model={model} />
        <LatestActivity model={model} />
      </div>

      <JobContext model={model} />

      {model.profile && (
        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title={t("candidate.profileTitle")} icon={UserRound}>
            <InfoItem
              label={t("candidate.summary")}
              value={model.profile.identity?.summary ?? model.profile.professional?.summary ?? "-"}
            />
            <InfoItem label={t("candidate.availability")} value={model.profile.availability?.status ?? "-"} />
          </InfoCard>

          <InfoCard title={t("candidate.linksTitle")} icon={Sparkles}>
            <InfoItem label="LinkedIn" value={model.profile.professional?.linkedin_url ?? "-"} />
            <InfoItem label="GitHub" value={model.profile.professional?.github_url ?? "-"} />
            <InfoItem label="Portfolio" value={model.profile.professional?.portfolio_url ?? "-"} />
          </InfoCard>
        </div>
      )}
    </div>
  )
}

function CandidateHeader({
  model,
  onStatusChange,
  isStatusPending,
}: CandidateInfoTabViewProps) {
  const { t } = useTranslation("employerApplicants")

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background-card shadow-card">
      <div className="border-b border-border bg-muted/30 px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary text-2xl font-bold text-white shadow-sm ring-4 ring-background">
              {model.avatarInitial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold leading-tight text-text-primary">{model.candidateName}</h2>
                <Badge variant="secondary" className="text-xs text-white">
                  {model.statusLabel}
                </Badge>
              </div>
              {model.headline && (
                <p className="mt-1 max-w-2xl text-sm text-text-muted">{model.headline}</p>
              )}
              <CandidateContact model={model} />
              <ProfileLinks links={model.links} />
            </div>
          </div>

          <StatusActions model={model} onStatusChange={onStatusChange} isStatusPending={isStatusPending} />
        </div>
      </div>

      <SummaryTiles model={model} />
    </section>
  )
}

function CandidateContact({ model }: { model: CandidateInfoModel }) {
  const contactItems = [
    { icon: Mail, value: model.contact.email },
    { icon: Phone, value: model.contact.phone },
    { icon: MapPin, value: model.contact.location },
  ].filter((item): item is { icon: ComponentType<{ className?: string }>; value: string } => Boolean(item.value))

  if (contactItems.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
      {contactItems.map(({ icon: Icon, value }) => (
        <span key={value} className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {value}
        </span>
      ))}
    </div>
  )
}

function ProfileLinks({ links }: { links: CandidateInfoModel["links"] }) {
  if (links.length === 0) return null

  return (
    <div className="mt-3 flex items-center gap-2">
      {links.map((link) => (
        <ProfileLink key={link.href} href={link.href} label={link.label} />
      ))}
    </div>
  )
}

function StatusActions({
  model,
  onStatusChange,
  isStatusPending,
}: CandidateInfoTabViewProps) {
  const { t } = useTranslation("employerApplicants")

  return (
    <div className="flex shrink-0 flex-col gap-3 rounded-lg border border-border bg-background-card p-4">
      {model.matchPercent != null && (
        <div className={cn(
          "rounded-md px-3 py-2 text-center text-sm font-semibold",
          model.matchTone === "success" && "bg-emerald-100 text-emerald-700",
          model.matchTone === "warning" && "bg-amber-100 text-amber-700",
          model.matchTone === "danger" && "bg-red-100 text-red-700",
        )}>
          {model.matchPercent}% {t("columns.match")}
        </div>
      )}
      {model.nextStatuses.length > 0 && (
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
              {model.nextStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`statuses.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

function SummaryTiles({ model }: { model: CandidateInfoModel }) {
  const { t } = useTranslation("employerApplicants")

  return (
    <div className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryTile icon={IdCard} label={t("candidate.applicationId")} value={model.summary.applicationId} />
      <SummaryTile icon={Briefcase} label={t("candidate.position")} value={model.summary.position} />
      <SummaryTile icon={Calendar} label={t("columns.applied")} value={model.summary.appliedAt} />
      <SummaryTile icon={Activity} label={t("candidate.latestStatus")} value={model.summary.latestStatus} />
    </div>
  )
}

function ApplicationSummary({ model }: { model: CandidateInfoModel }) {
  const { t } = useTranslation("employerApplicants")

  return (
    <InfoCard title={t("candidate.applicationTitle")} icon={FileText}>
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoItem label={t("columns.status")} value={model.applicationSummary.status} />
        <InfoItem label={t("candidate.lastUpdated")} value={model.applicationSummary.lastUpdated} />
        <InfoItem label={t("candidate.snapshotStatus")} value={model.applicationSummary.snapshotStatus} />
        <InfoItem
          label={t("candidate.profileConsent")}
          value={model.applicationSummary.consentToShareProfile ? t("answers.yes") : t("answers.no")}
        />
      </div>
    </InfoCard>
  )
}

function LatestActivity({ model }: { model: CandidateInfoModel }) {
  const { t } = useTranslation("employerApplicants")

  return (
    <InfoCard title={t("candidate.latestActivity")} icon={Clock}>
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoItem label={t("candidate.latestStatus")} value={model.latestActivity.status} />
        <InfoItem label={t("candidate.changedBy")} value={model.latestActivity.changedBy} />
        <InfoItem label={t("candidate.changedAt")} value={model.latestActivity.changedAt} />
      </div>
      {model.latestActivity.note && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-medium text-text-muted">{t("interview.notes")}</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{model.latestActivity.note}</p>
        </div>
      )}
    </InfoCard>
  )
}

function JobContext({ model }: { model: CandidateInfoModel }) {
  const { t } = useTranslation("employerApplicants")
  const hasSkills = model.skills.required.length > 0 || model.skills.niceToHave.length > 0

  return (
    <InfoCard title={t("candidate.jobTitle")} icon={Briefcase}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label={t("candidate.position")} value={model.job.title} />
        <InfoItem label={t("candidate.department")} value={model.job.department} />
        <InfoItem label={t("candidate.employmentType")} value={model.job.employmentType} />
        <InfoItem label={t("candidate.experienceLevel")} value={model.job.experienceLevel} />
        <InfoItem label={t("candidate.educationLevel")} value={model.job.educationLevel} />
        <InfoItem label={t("candidate.workMode")} value={model.job.workMode} />
        <InfoItem label={t("candidate.location")} value={model.job.location} />
        <InfoItem label={t("candidate.salary")} value={model.job.salary} />
      </div>

      {hasSkills && (
        <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <SkillGroup title={t("candidate.requiredSkills")} skills={model.skills.required} />
          <SkillGroup title={t("candidate.niceSkills")} skills={model.skills.niceToHave} />
        </div>
      )}
    </InfoCard>
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
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-background-card p-5 shadow-card transition-shadow hover:shadow-md">
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
  if (skills.length === 0) return null

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
