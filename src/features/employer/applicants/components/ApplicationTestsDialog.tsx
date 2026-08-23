import { useEffect, useMemo, useState } from "react"
import {
  FileText,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { candidateDisplayName } from "../utils/candidateDisplay"
import { getAllowedApplicationActions } from "../utils/applicationActions"
import { useApplicationTestGrading } from "../hooks/useApplicationTestGrading"
import TestAssignmentDeadlinePanel from "./TestAssignmentDeadlinePanel"
import TestAssignmentRetakePanel from "./TestAssignmentRetakePanel"
import type { EmployerApplicant, EmployerTestAttempt } from "../types/employerApplicants.types"
import {
  assignmentDeadline,
  assignmentId,
  attemptMaxScore,
  attemptScore,
} from "../utils/applicationTests"
import ApplicationTestGradingPanel from "./application-tests/ApplicationTestGradingPanel"
import ApplicationTestsList from "./application-tests/ApplicationTestsList"
import ApplicationTestsNextStep from "./application-tests/ApplicationTestsNextStep"

export default function ApplicationTestsDialog({
  application,
  open,
  onOpenChange,
  onNextStep,
}: {
  application: EmployerApplicant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNextStep?: (applicationId: string | number, status: string) => Promise<unknown>
}) {
  const { t } = useTranslation("employerApplicants")
  const grading = useApplicationTestGrading({ applicationId: application?.id, open })
  const allowedNextSteps = useMemo(() => {
    const targets = getAllowedApplicationActions(application).statusTargets
    return targets.map((status) => ({
      value: status,
      labelKey: `statuses.${status}`,
    }))
  }, [application])
  const [deadlineAttempt, setDeadlineAttempt] = useState<EmployerTestAttempt | null>(null)
  const [retakeAttempt, setRetakeAttempt] = useState<EmployerTestAttempt | null>(null)
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({})
  const [nextStep, setNextStep] = useState("")
  const [nextStepLoading, setNextStepLoading] = useState(false)

  const hasAnyResult =
    grading.tests.data?.items.some((assignment) => assignment.attempt?.total_score != null) ||
    Boolean(grading.result)
  const activeMaxScore = attemptMaxScore(grading.gradingAttempt)

  useEffect(() => {
    if (!open) {
      grading.resetGrading()
      setDeadlineAttempt(null)
      setRetakeAttempt(null)
      setShowAnswers({})
      setNextStep("")
    }
  }, [grading, open])

  const handleNextStep = async () => {
    if (!application || !nextStep) return
    if (!allowedNextSteps.some((step) => step.value === nextStep)) return
    setNextStepLoading(true)
    try {
      await onNextStep?.(application.id, nextStep)
    } finally {
      setNextStepLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("tests.title")}</DialogTitle>
          <DialogDescription>
            {candidateDisplayName(application, t("unknownCandidate"))}
          </DialogDescription>
        </DialogHeader>

        {grading.tests.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : grading.tests.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {t("tests.loadError")}
            <Button variant="link" onClick={() => void grading.tests.refetch()}>
              {t("tests.retry")}
            </Button>
          </div>
        ) : grading.tests.data?.items.length === 0 ? (
          <EmptyState
            title={t("tests.empty")}
            description={t("tests.title")}
            icon={FileText}
            className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
          />
        ) : (
          <ApplicationTestsList
            attempts={grading.tests.data?.items ?? []}
            showAnswers={showAnswers}
            onToggleAnswers={(key) =>
              setShowAnswers((prev) => ({
                ...prev,
                [key]: !prev[key],
              }))
            }
            onOpenGrading={grading.setGradingAttempt}
            onOpenDeadline={setDeadlineAttempt}
            onOpenRetakes={setRetakeAttempt}
          />
        )}

        {deadlineAttempt && assignmentId(deadlineAttempt) && (
          <TestAssignmentDeadlinePanel
            assignmentId={assignmentId(deadlineAttempt)!}
            currentDeadline={assignmentDeadline(deadlineAttempt)}
            testTitle={deadlineAttempt.test?.title}
            onClose={() => setDeadlineAttempt(null)}
            onUpdated={async () => {
              await grading.tests.refetch()
            }}
          />
        )}

        {retakeAttempt && assignmentId(retakeAttempt) && (
          <TestAssignmentRetakePanel
            assignmentId={assignmentId(retakeAttempt)!}
            currentMaxAttempts={retakeAttempt.max_attempts}
            testTitle={retakeAttempt.test?.title}
            onClose={() => setRetakeAttempt(null)}
            onUpdated={async () => {
              await grading.tests.refetch()
            }}
          />
        )}

        {grading.gradingAttempt && (
          <ApplicationTestGradingPanel
            gradingAttempt={grading.gradingAttempt}
            answers={grading.answers}
            result={grading.result}
            drafts={grading.drafts}
            loadingDetails={grading.loadingDetails}
            downloadingQuestionId={grading.downloadingQuestionId}
            manualAnswersLength={grading.manualAnswers.length}
            isGradingBusy={grading.isGradingBusy}
            activeMaxScore={activeMaxScore}
            onClose={grading.resetGrading}
            onUpdateDraft={grading.updateDraft}
            onSaveAnswer={grading.saveAnswerGrade}
            onDeleteAnswer={grading.deleteAnswerGrade}
            onDownloadFile={grading.downloadAnswerFile}
            onRefresh={() => grading.loadAttemptDetails(grading.gradingAttempt!)}
            onBulkSave={grading.saveBulkGrades}
            bulkSaving={grading.tests.bulkGradeMutation.isPending}
          />
        )}

        {hasAnyResult && onNextStep && allowedNextSteps.length > 0 && (
          <ApplicationTestsNextStep
            allowedNextSteps={allowedNextSteps}
            nextStep={nextStep}
            nextStepLoading={nextStepLoading}
            onNextStepChange={setNextStep}
            onApply={handleNextStep}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
