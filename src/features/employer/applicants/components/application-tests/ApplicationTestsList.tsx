import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  ListChecks,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { keyOf } from "@/lib/keyValue"
import type { EmployerTestAttempt } from "../../types/employerApplicants.types"
import {
  assignmentDeadline,
  assignmentId,
  attemptId,
  attemptMaxScore,
  attemptScore,
  formatDeadline,
} from "../../utils/applicationTests"

export default function ApplicationTestsList({
  attempts,
  showAnswers,
  onToggleAnswers,
  onOpenGrading,
  onOpenDeadline,
  onOpenRetakes,
}: {
  attempts: EmployerTestAttempt[]
  showAnswers: Record<string, boolean>
  onToggleAnswers: (key: string) => void
  onOpenGrading: (attempt: EmployerTestAttempt) => void
  onOpenDeadline: (attempt: EmployerTestAttempt) => void
  onOpenRetakes: (attempt: EmployerTestAttempt) => void
}) {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => {
        const id = attemptId(attempt)
        const score = attemptScore(attempt)
        const max = attemptMaxScore(attempt)
        const passed = attempt.attempt?.is_passing_score_met
        const attemptStatusKey = keyOf(attempt.state)
        const submitted =
          Boolean(attempt.attempt?.submitted_at) ||
          attemptStatusKey === "submitted" ||
          attemptStatusKey === "evaluated"
        const isOpen = showAnswers[String(id)]
        const deadline = assignmentDeadline(attempt)
        const assignment = assignmentId(attempt)

        return (
          <div key={id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-text-primary">
                  {attempt.test?.title || t("tests.untitled")}
                </p>
                <p className="mt-1 text-xs text-text-muted">{t("tests.maxScore", { score: max })}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {t("tests.deadlineLabel", { deadline: formatDeadline(deadline) })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={
                    score != null ? (passed ? "completed" : "reviewed") : attemptStatusKey || "pending"
                  }
                  variant="soft"
                />
                {submitted && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onOpenGrading(attempt)}>
                      <CheckCircle2 className="h-4 w-4" /> {t("tests.gradeAnswers")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const currentAttemptId = attemptId(attempt)
                        const currentTestId = attempt.test?.id ?? currentAttemptId
                        if (currentAttemptId && currentTestId) {
                          navigate(ROUTES.employer.testAttemptGrading(currentTestId, currentAttemptId))
                        }
                      }}
                    >
                      <FileText className="h-4 w-4" /> {t("tests.openGradingPage")}
                    </Button>
                  </>
                )}
                {assignment && (
                  <Button size="sm" variant="outline" onClick={() => onOpenDeadline(attempt)}>
                    <CalendarClock className="h-4 w-4" /> {t("tests.manageDeadline")}
                  </Button>
                )}
                {assignment && (
                  <Button size="sm" variant="outline" onClick={() => onOpenRetakes(attempt)}>
                    <History className="h-4 w-4" /> {t("tests.manageRetakes")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onToggleAnswers(String(id))}
                >
                  <ListChecks className="h-4 w-4" />
                  {isOpen ? t("tests.hideDetails") : t("tests.showDetails")}
                  {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            {score != null && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">{t("tests.result", { score, max })}</p>
                {attempt.feedback && (
                  <p className="text-sm text-text-muted">
                    <span className="font-medium">{t("tests.feedback")}:</span> {attempt.feedback}
                  </p>
                )}
              </div>
            )}
            {isOpen && (
              <p className="mt-3 rounded-md border border-border bg-background p-3 text-sm text-text-muted">
                {submitted ? t("tests.openForGradingHint") : t("tests.notSubmittedHint")}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
