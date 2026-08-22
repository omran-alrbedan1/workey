import { Eye } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { StatusBadge } from "@/components/shared/badges"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROUTES } from "@/config"
import { cn } from "@/lib/utils"
import { valueOf } from "@/lib/keyValue"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerApplicantDetail } from "@/features/employer/applicants/types/employerApplicants.types"
import {
  candidateDisplayName,
  candidateSecondaryText,
} from "@/features/employer/applicants/utils/candidateDisplay"
import {
  matchScorePercent,
  type JobApplicantRow,
  type JobApplicantSortKey,
} from "../hooks/useJobApplicants"

const MAX_SKILL_BADGES = 3

function scoreColorClass(score: number | null): string {
  if (score == null) return "text-text-muted"
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

function SkillBadges({
  skills,
  tone,
  label,
}: {
  skills?: Array<{ id: string | number; name?: string }> | null
  tone: "matched" | "missing"
  label: string
}) {
  const list = skills ?? []
  if (list.length === 0) return <span className="text-sm text-text-muted">-</span>
  const visible = list.slice(0, MAX_SKILL_BADGES)
  return (
    <div className="max-w-[220px] space-y-1" aria-label={label}>
      <div className="flex flex-wrap gap-1">
        {visible.map((skill) => (
          <span
            key={String(skill.id)}
            className={cn(
              "inline-flex max-w-[110px] items-center truncate rounded-full px-2 py-0.5 text-xs font-medium",
              tone === "matched"
                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                : "border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300",
            )}
            title={skill.name || `#${skill.id}`}
          >
            {skill.name?.trim() || `#${skill.id}`}
          </span>
        ))}
        {list.length > MAX_SKILL_BADGES && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-text-muted">
            +{list.length - MAX_SKILL_BADGES}
          </span>
        )}
      </div>
    </div>
  )
}

interface EmployerJobApplicantsTabProps {
  rows: JobApplicantRow[]
  collection?: EmployerCollection<EmployerApplicantDetail>
  isLoading: boolean
  isError: boolean
  sortBy: JobApplicantSortKey
  onSortChange: (sort: JobApplicantSortKey) => void
  onRetry: () => void
  page?: number
  onPageChange?: (page: number) => void
}

export default function EmployerJobApplicantsTab({
  rows,
  collection,
  isLoading,
  isError,
  sortBy,
  onSortChange,
  onRetry,
  onPageChange,
}: EmployerJobApplicantsTabProps) {
  const { t, i18n } = useTranslation("employerJobs")
  const navigate = useNavigate()

  const openDetails = (row: JobApplicantRow) => navigate(ROUTES.employer.applicantDetails(row.id))

  const sortOptions: { value: JobApplicantSortKey; label: string }[] = [
    { value: "newest", label: t("applicantsTab.sort.newest") },
    { value: "match_desc", label: t("applicantsTab.sort.matchHighToLow") },
    { value: "match_asc", label: t("applicantsTab.sort.matchLowToHigh") },
  ]

  const columns: Column<JobApplicantRow>[] = [
    {
      key: "candidate",
      header: t("applicantsTab.columns.candidate"),
      cell: (row) => (
        <div className="min-w-[160px]">
          <p className="font-semibold text-text-primary">
            {candidateDisplayName(row, t("applicantsTab.unknownCandidate"))}
          </p>
          <p className="truncate text-xs text-text-muted">{candidateSecondaryText(row, "-")}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("applicantsTab.columns.status"),
      cell: (row) => <StatusBadge status={row.status} label={valueOf(row.status)} variant="soft" />,
    },
    {
      key: "applied_at",
      header: t("applicantsTab.columns.appliedAt"),
      cell: (row) => {
        const date = row.applied_at || row.created_at
        return date ? new Date(date).toLocaleDateString(i18n.language) : "-"
      },
    },
    {
      key: "match_score",
      header: t("applicantsTab.columns.matchScore"),
      cell: (row) => {
        const score = matchScorePercent(row)
        if (score == null) return <span className="text-text-muted">-</span>
        return (
          <span
            className={cn("font-semibold", scoreColorClass(score))}
            title={t("applicantsTab.matchHelperHint")}
          >
            {score}%
          </span>
        )
      },
    },
    {
      key: "matched_skills",
      header: t("applicantsTab.columns.matchedSkills"),
      cell: (row) => (
        <SkillBadges
          skills={row.ranked?.matched_skills}
          tone="matched"
          label={t("applicantsTab.columns.matchedSkills")}
        />
      ),
    },
    {
      key: "missing_skills",
      header: t("applicantsTab.columns.missingSkills"),
      cell: (row) => (
        <SkillBadges
          skills={row.ranked?.missing_skills}
          tone="missing"
          label={t("applicantsTab.columns.missingSkills")}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-end",
      cell: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation()
            openDetails(row)
          }}
          aria-label={t("applicantsTab.viewDetails")}
        >
          <Eye className="h-4 w-4" /> {t("applicantsTab.viewDetails")}
        </Button>
      ),
    },
  ]

  return (
    <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-text-primary">{t("tabs.applicants")}</h2>
          <p className="text-sm text-text-muted">{t("applicantsTab.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="job-applicants-sort" className="shrink-0 text-sm text-text-muted">
            {t("applicantsTab.sort.label")}
          </label>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as JobApplicantSortKey)}
          >
            <SelectTrigger id="job-applicants-sort" className="w-[220px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-red-600">{t("applicantsTab.loadError")}</p>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={onRetry}
          >
            {t("applicantsTab.retry")}
          </button>
        </div>
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading}
          pagination={{
            total: collection?.pagination.total ?? 0,
            page: collection?.pagination.currentPage ?? 1,
            lastPage: collection?.pagination.lastPage ?? 1,
            perPage: collection?.pagination.perPage,
          }}
          onPageChange={(page) => onPageChange?.(page)}
          onRowClick={openDetails}
          emptyMessage={t("applicantsTab.emptyTitle")}
          emptyDescription={t("applicantsTab.emptyDescription")}
          className="bg-background shadow-none"
        />
      )}
    </section>
  )
}
