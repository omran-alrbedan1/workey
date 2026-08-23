import { Download, FileText, ListChecks, Loader2, RotateCcw, Save, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@/components/shared/badges"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { valueOf } from "@/lib/keyValue"
import type { EmployerTestAttempt } from "../../types/employerApplicants.types"
import {
  canManuallyGrade,
  getQuestionId,
  getQuestionPoints,
  getResultMax,
  getResultScore,
  getSelectedAnswer,
  type GradeDraft,
} from "../../utils/applicationTests"
import type {
  TestAttemptResult,
  TestAttemptResultBreakdownItem,
} from "@/features/employer/tests/types/employerTests.types"

export default function ApplicationTestGradingPanel({
  gradingAttempt,
  answers,
  result,
  drafts,
  loadingDetails,
  downloadingQuestionId,
  manualAnswersLength,
  isGradingBusy,
  activeMaxScore,
  onClose,
  onUpdateDraft,
  onSaveAnswer,
  onDeleteAnswer,
  onDownloadFile,
  onRefresh,
  onBulkSave,
  bulkSaving,
}: {
  gradingAttempt: EmployerTestAttempt
  answers: TestAttemptResultBreakdownItem[]
  result: TestAttemptResult | null
  drafts: Record<string, GradeDraft>
  loadingDetails: boolean
  downloadingQuestionId: string | number | null
  manualAnswersLength: number
  isGradingBusy: boolean
  activeMaxScore: number
  onClose: () => void
  onUpdateDraft: (questionId: string | number, field: keyof GradeDraft, value: string) => void
  onSaveAnswer: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  onDeleteAnswer: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  onDownloadFile: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  onRefresh: () => Promise<void>
  onBulkSave: () => Promise<void>
  bulkSaving: boolean
}) {
  const { t } = useTranslation("employerApplicants")
  const resultScore = getResultScore(result)
  const resultMax = getResultMax(result, activeMaxScore)

  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{t("tests.gradingTitle")}</h3>
          <p className="text-sm text-text-muted">{gradingAttempt.test?.title || t("tests.untitled")}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          {t("tests.closeGrading")}
        </Button>
      </div>

      {loadingDetails ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.gradingStatus")}</p>
              <p className="mt-1 font-medium">{valueOf(result?.grading_status ?? gradingAttempt.status, "-")}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.currentScore")}</p>
              <p className="mt-1 font-medium">{resultScore == null ? "-" : resultScore} / {resultMax}</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.manualProgress")}</p>
              <p className="mt-1 font-medium">
                {result?.manual_grading_progress
                  ? `${result.manual_grading_progress.graded}/${result.manual_grading_progress.total}`
                  : `${answers.filter((answer) => answer.awarded_points != null).length}/${manualAnswersLength}`}
              </p>
            </div>
          </div>

          {answers.length === 0 ? (
            <EmptyState
              title={t("tests.noAnswers")}
              description={t("tests.noAnswers")}
              icon={ListChecks}
              className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
            />
          ) : (
            <div className="space-y-3">
              {answers.map((answer, index) => {
                const questionId = getQuestionId(answer)
                const draft = drafts[String(questionId)] ?? { awarded_points: "", reviewer_note: "" }
                const maxPoints = getQuestionPoints(answer)
                const manual = canManuallyGrade(answer)
                const questionType = answer.question_type

                return (
                  <div key={questionId} className="rounded-md border border-border bg-background p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {index + 1}. {answer.question_text ?? t("tests.unknownQuestion")}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {valueOf(questionType, "-")} - {maxPoints} {t("tests.points")}
                        </p>
                      </div>
                      {answer.awarded_points != null && <StatusBadge status="reviewed" variant="soft" size="sm" />}
                    </div>

                    <div className="mt-3 rounded-md bg-muted/40 p-3">
                      <p className="mb-1 text-xs font-medium text-text-muted">{t("tests.candidateAnswer")}</p>
                      <p className="whitespace-pre-wrap text-sm">{getSelectedAnswer(answer)}</p>
                      {answer.file?.download_available && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          disabled={downloadingQuestionId === questionId}
                          onClick={() => void onDownloadFile(answer)}
                        >
                          {downloadingQuestionId === questionId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {answer.file.original_name ?? t("tests.downloadFile")}
                        </Button>
                      )}
                    </div>

                    {manual ? (
                      <div className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr_auto]">
                        <div className="space-y-2">
                          <Label htmlFor={`grade-${questionId}`}>{t("tests.awardedPoints", { max: maxPoints })}</Label>
                          <Input
                            id={`grade-${questionId}`}
                            type="number"
                            min={0}
                            max={maxPoints}
                            step={0.5}
                            value={draft.awarded_points}
                            onChange={(event) => onUpdateDraft(questionId, "awarded_points", event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`note-${questionId}`}>{t("tests.reviewerNote")}</Label>
                          <Textarea
                            id={`note-${questionId}`}
                            rows={2}
                            value={draft.reviewer_note}
                            onChange={(event) => onUpdateDraft(questionId, "reviewer_note", event.target.value)}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            disabled={isGradingBusy}
                            onClick={() => void onSaveAnswer(answer)}
                            aria-label={t("tests.saveGrade")}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50"
                            disabled={isGradingBusy || answer.awarded_points == null}
                            onClick={() => void onDeleteAnswer(answer)}
                            aria-label={t("tests.deleteGrade")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3 text-sm text-text-muted">
                        <FileText className="h-4 w-4" />
                        {answer.awarded_points == null
                          ? t("tests.autoGradePending")
                          : t("tests.autoGradeResult", { score: answer.awarded_points, max: maxPoints })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => void onRefresh()}>
              <RotateCcw className="h-4 w-4" /> {t("tests.refreshResult")}
            </Button>
            <Button
              type="button"
              disabled={manualAnswersLength === 0 || isGradingBusy}
              onClick={() => void onBulkSave()}
            >
              {bulkSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("tests.bulkSave")}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
