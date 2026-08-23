import { Link } from "lucide-react"
import type { ComponentType, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type {
  ApplicationSnapshotProfile,
  EmployerApplicantDetail,
} from "../../types/employerApplicants.types"

export function SectionCard({
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

export function InfoItem({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-text-primary">{value || "-"}</p>
    </div>
  )
}

export function TimelineItem({
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

export function SkillGroup({
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

export function ProfileLinkItems({ profile }: { profile: ApplicationSnapshotProfile }) {
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
    return (
      <EmptyState
        title={t("common:noLinks", { defaultValue: "No links available" })}
        description={t("common:noLinksDescription", { defaultValue: "This profile has no links." })}
        className="rounded-lg border border-dashed border-border/60 bg-background-secondary/40 py-6"
      />
    )
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

export function hostOf(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function formatPeriod(
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

export function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

export function formatSalary(min?: string | number | null, max?: string | number | null) {
  if (!min && !max) return "-"
  if (min && max) return `${min} - ${max}`
  return String(min ?? max)
}
