import { AlertCircle, CheckCircle2, HelpCircle, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { RankedCandidate } from "../types/employerJobs.types"

function toNum(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v
  if (v && typeof v === "object" && "value" in (v as object)) return toNum((v as Record<string, unknown>).value)
  const n = Number(v)
  return Number.isNaN(n) ? 0 : n
}

function toStr(v: unknown): string {
  if (typeof v === "string") return v
  if (typeof v === "number") return String(v)
  if (v && typeof v === "object" && "value" in (v as object)) return toStr((v as Record<string, unknown>).value)
  return ""
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200"
  if (score >= 60) return "bg-amber-50 border-amber-200"
  return "bg-red-50 border-red-200"
}

const breakdownLabels: Record<string, string> = {
  skills: "rankedCandidates.breakdown.skills",
  experience: "rankedCandidates.breakdown.experience",
  education: "rankedCandidates.breakdown.education",
  recency: "rankedCandidates.breakdown.recency",
  profile_completeness: "rankedCandidates.breakdown.profileCompleteness",
}

function CandidateCard({ candidate }: { candidate: RankedCandidate }) {
  const { t } = useTranslation("employerJobs")
  const score = toNum(candidate.score ?? candidate.matching_score)
  const version = toStr(candidate.matching_score_version)

  return (
    <Card className={cn("border", scoreBg(score))}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <span className={cn("text-2xl font-bold", scoreColor(score))}>
              {Math.round(score)}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {t("rankedCandidates.score")}
            </p>
            {version && (
              <p className="text-xs text-muted-foreground">
                {t("rankedCandidates.version")}: {version}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {candidate.breakdown && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t("rankedCandidates.breakdown.title")}
            </h4>
            <div className="space-y-2">
              {Object.entries(breakdownLabels).map(([key, labelKey]) => {
                const raw = candidate.breakdown?.[key]
                if (raw === undefined || raw === null) return null
                const value = toNum(raw)
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-36 text-xs text-muted-foreground">
                      {t(labelKey)}
                    </span>
                    <Progress
                      value={value}
                      className="flex-1"
                    />
                    <span className={cn("w-8 text-right text-xs font-medium", scoreColor(value))}>
                      {Math.round(value)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {candidate.matched_skills && candidate.matched_skills.length > 0 && (
            <div className="space-y-1">
              <h4 className="flex items-center gap-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("rankedCandidates.matchedSkills")}
              </h4>
              <div className="flex flex-wrap gap-1">
                {candidate.matched_skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    {toStr(skill.name) || `#${skill.id}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {candidate.missing_skills && candidate.missing_skills.length > 0 && (
            <div className="space-y-1">
              <h4 className="flex items-center gap-1 text-xs font-medium text-red-700">
                <XCircle className="h-3.5 w-3.5" />
                {t("rankedCandidates.missingSkills")}
              </h4>
              <div className="flex flex-wrap gap-1">
                {candidate.missing_skills.map((skill) => (
                  <Badge key={skill.id} variant="outline" className="border-red-200 text-red-700">
                    {toStr(skill.name) || `#${skill.id}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {candidate.reasons && candidate.reasons.length > 0 && (
          <div className="space-y-1">
            <h4 className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5" />
              {t("rankedCandidates.reasons")}
            </h4>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              {candidate.reasons.map((reason, i) => (
                <li key={i}>{toStr(reason)}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function EmployerJobRankedCandidates({
  candidates,
  isLoading,
  isError,
  onRetry,
}: {
  candidates: RankedCandidate[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}) {
  const { t } = useTranslation("employerJobs")

  if (isLoading) {
    return (
      <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
        <div>
          <h2 className="font-semibold text-text-primary">{t("rankedCandidates.title")}</h2>
          <p className="text-sm text-text-muted">{t("rankedCandidates.description")}</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
        <div>
          <h2 className="font-semibold text-text-primary">{t("rankedCandidates.title")}</h2>
          <p className="text-sm text-text-muted">{t("rankedCandidates.description")}</p>
        </div>
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{t("rankedCandidates.loadError")}</p>
          {onRetry && (
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={onRetry}
            >
              {t("rankedCandidates.retry")}
            </button>
          )}
        </div>
      </section>
    )
  }

  if (!candidates.length) {
    return (
      <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
        <div>
          <h2 className="font-semibold text-text-primary">{t("rankedCandidates.title")}</h2>
          <p className="text-sm text-text-muted">{t("rankedCandidates.description")}</p>
        </div>
        <p className="py-4 text-center text-sm text-text-muted">{t("rankedCandidates.empty")}</p>
      </section>
    )
  }

  return (
    <section className="space-y-4 rounded-lg border border-border bg-background-card p-5 shadow-card">
      <div>
        <h2 className="font-semibold text-text-primary">{t("rankedCandidates.title")}</h2>
        <p className="text-sm text-text-muted">{t("rankedCandidates.description")}</p>
      </div>
      <div className="space-y-4">
        {candidates.map((candidate, i) => (
          <CandidateCard key={candidate.application_id ?? candidate.candidate_id ?? i} candidate={candidate} />
        ))}
      </div>
    </section>
  )
}
