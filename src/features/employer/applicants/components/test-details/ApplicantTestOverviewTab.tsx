import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@/components/shared/badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { EmployerTestAttempt } from "../../types/employerApplicants.types"
import { assignmentDeadline, formatDate } from "./testDetails.helpers"

interface ApplicantTestOverviewTabProps {
  assignment: EmployerTestAttempt
  score: number | null
  maxScore: number
}

export default function ApplicantTestOverviewTab({
  assignment,
  score,
  maxScore,
}: ApplicantTestOverviewTabProps) {
  const { t } = useTranslation("employerApplicants")
  const scorePercent = maxScore > 0 && score != null ? Math.round((score / maxScore) * 100) : null

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-text-muted">{t("columns.status")}</p>
            <StatusBadge status={assignment.state} variant="soft" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-text-muted">{t("tests.deadlineTitle")}</p>
            <p className="font-semibold text-text-primary">
              {formatDate(assignmentDeadline(assignment))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="text-xs text-text-muted">{t("tests.currentScore")}</p>
            <p className="font-semibold text-text-primary">
              {score == null ? "-" : `${score} / ${maxScore}`}
            </p>
            {scorePercent != null && <Progress value={scorePercent} className="h-1.5" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-text-muted">{t("tests.attemptsRemaining")}</p>
            <p className="font-semibold text-text-primary">
              {assignment.attempts_remaining} / {assignment.max_attempts}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            {t("interview.notes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm text-text-secondary">
            {assignment.test?.instructions || assignment.test?.description || t("tests.empty")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
