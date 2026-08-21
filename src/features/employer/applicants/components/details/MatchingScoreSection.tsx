import { CheckCircle2, CircleDashed, Target } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApplicationSkillReference, EmployerApplicantDetail } from "../../types/employerApplicants.types"
import CvSummaryPanel from "../CvSummaryPanel"
import { SectionCard } from "./section-ui"

interface MatchingScoreSectionProps {
  application: EmployerApplicantDetail
}

function normalizeSkillKey(value?: string | null) {
  return (value ?? "").trim().toLowerCase()
}

function skillKeys(skill: ApplicationSkillReference) {
  return [normalizeSkillKey(skill.slug), normalizeSkillKey(skill.name)].filter(Boolean)
}

export default function MatchingScoreSection({ application }: MatchingScoreSectionProps) {
  const { t } = useTranslation("employerApplicants")
  const profile = application.submitted_snapshot?.profile
  const job = application.job_posting
  const rawScore = application.match_score ?? application.matching_score

  const candidateSkillKeys = useMemo(
    () => new Set((profile?.skills ?? []).flatMap(skillKeys)),
    [profile],
  )

  const requiredSkills = job?.required_skills ?? []
  const niceSkills = job?.nice_to_have_skills ?? []

  const matchedRequired = useMemo(
    () => requiredSkills.filter((skill) => skillKeys(skill).some((key) => candidateSkillKeys.has(key))),
    [requiredSkills, candidateSkillKeys],
  )
  const missingRequired = useMemo(
    () => requiredSkills.filter((skill) => !matchedRequired.includes(skill)),
    [requiredSkills, matchedRequired],
  )
  const matchedNice = useMemo(
    () => niceSkills.filter((skill) => skillKeys(skill).some((key) => candidateSkillKeys.has(key))),
    [niceSkills, candidateSkillKeys],
  )

  const percent =
    rawScore == null ? null : rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore)

  if (rawScore == null && requiredSkills.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
        {t("matching.unavailable")}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <SectionCard title={t("matching.title")} icon={Target}>
        {percent != null && (
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={cn(
                "flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 text-center",
                percent >= 70
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : percent >= 40
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              <span className="text-xl font-bold leading-none">{percent}%</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                {t("columns.match")}
              </span>
            </div>
            <p className="max-w-md text-sm text-text-muted">{t("matching.supportOnly")}</p>
          </div>
        )}

        {requiredSkills.length > 0 ? (
          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-text-muted">{t("matching.matchedSkills")}</p>
              <div className="flex flex-wrap gap-2">
                {matchedRequired.length === 0 ? (
                  <span className="text-sm text-text-muted">-</span>
                ) : (
                  matchedRequired.map((skill) => (
                    <Badge key={skill.id ?? skill.slug ?? skill.name} variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {skill.name}
                    </Badge>
                  ))
                )}
              </div>
              {matchedRequired.length === requiredSkills.length && (
                <p className="mt-2 text-xs font-medium text-emerald-700">{t("matching.allRequiredMatched")}</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-text-muted">{t("matching.missingSkills")}</p>
              <div className="flex flex-wrap gap-2">
                {missingRequired.length === 0 ? (
                  <span className="text-sm text-text-muted">-</span>
                ) : (
                  missingRequired.map((skill) => (
                    <Badge key={skill.id ?? skill.slug ?? skill.name} variant="secondary" className="bg-red-500/10 text-red-700">
                      <CircleDashed className="mr-1 h-3 w-3" />
                      {skill.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            {(matchedNice.length ?? 0) > 0 && (
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-medium text-text-muted">{t("matching.niceMatched")}</p>
                <div className="flex flex-wrap gap-2">
                  {matchedNice.map((skill) => (
                    <Badge key={skill.id ?? skill.slug ?? skill.name} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-text-muted">{t("matching.noRequiredSkills")}</p>
        )}
      </SectionCard>

      {application.id && <CvSummaryPanel applicationId={application.id} />}
    </div>
  )
}
