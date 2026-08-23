import { useState } from "react"
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  ListChecks,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { valueOf } from "@/lib/keyValue"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { EmployerTestAttempt } from "../types/employerApplicants.types"
import type {
  TestAttemptResult,
  TestAttemptResultBreakdownItem,
} from "@/features/employer/tests/types/employerTests.types"
import {
  canManuallyGrade,
  getQuestionId,
  getQuestionPoints,
  getSelectedAnswer,
  getResultMax,
  getResultScore,
} from "../utils/testAttemptHelpers"

type GradeDraft = {
  awarded_points: string
  reviewer_note: string
}

interface TestGradingPanelProps {
  attempt: EmployerTestAttempt
  onClose: () => void
  onGradingComplete: () => void
  gradeMutation: any
  deleteGradeMutation: any
  bulkGradeMutation: any
}

export default function TestGradingPanel({
  attempt,
  onClose,
  onGradingComplete,
  gradeMutation,
  deleteGradeMutation,
  bulkGradeMutation,
}: TestGradingPanelProps) {
  const { t } = useTranslation("employerApplicants")
  const [answers, setAnswers] = useState<TestAttemptResultBreakdownItem[]>([])
  const [result, setResult] = useState<TestAttemptResult | null>(null)
  const [drafts, setDrafts] = useState<Record<string, GradeDraft>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [downloadingQuestionId, setDownloadingQuestionId] = useState<string | number | null>(null)

  const attemptId = attempt.attempt?.id ?? null
  const manualAnswers = answers.filter(canManuallyGrade)
  const activeMaxScore = attempt.attempt?.max_score ?? Number(attempt.test?.max_score ?? 0)
  const resultScore = getResultScore(result)
  const resultMax = getResultMax(result, activeMaxScore)

  const resetGrading = () => {
    setAnswers([])
    setResult(null)
    setDrafts({})
    setDownloadingQuestionId(null)
  }

  const loadAttemptDetails = async () => {
    if (!attemptId) return

    setLoadingDetails(true)
    try {
      const nextResult = await employerTestsService.getAttemptResult(attemptId)
      const nextAnswers = nextResult.breakdown ?? []
      setAnswers(nextAnswers)
      setResult(nextResult)
      setDrafts(
        nextAnswers.reduce<Record<string, GradeDraft>>((acc, answer) => {
          const questionId = String(getQuestionId(answer))
          acc[questionId] = {
            awarded_points: answer.awarded_points == null ? "" : String(answer.awarded_points),
            reviewer_note: answer.reviewer_note ?? "",
          }
          return acc
        }, {}),
      )
    } catch (error) {
      showErrorToast(error, t("tests.gradingLoadError"))
      setAnswers([])
      setResult(null)
      setDrafts({})
    } finally {
      setLoadingDetails(false)
    }
  }

  const updateDraft = (questionId: string | number, field: keyof GradeDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [String(questionId)]: {
        awarded_points: current[String(questionId)]?.awarded_points ?? "",
        reviewer_note: current[String(questionId)]?.reviewer_note ?? "",
        [field]: value,
      },
    }))
  }

  const saveAnswerGrade = async (answer: TestAttemptResultBreakdownItem) => {
    if (!attemptId) return
    const questionId = getQuestionId(answer)
    const draft = drafts[String(questionId)]
    const maxPoints = getQuestionPoints(answer)
    const awardedPoints = Number(draft?.awarded_points)

    if (!Number.isFinite(awardedPoints) || awardedPoints < 0 || awardedPoints > maxPoints) {
      showErrorToast(t("tests.invalidGrade"))
      return
    }

    await gradeMutation.mutateAsync({
      attemptId,
      questionId,
      mode: answer.graded_at == null ? "create" : "update",
      input: {
        awarded_points: awardedPoints,
        reviewer_note: draft?.reviewer_note?.trim() || null,
      },
    })
    await loadAttemptDetails()
  }

  const deleteAnswerGrade = async (answer: TestAttemptResultBreakdownItem) => {
    if (!attemptId) return
    await deleteGradeMutation.mutateAsync({
      attemptId,
      questionId: getQuestionId(answer),
    })
    await loadAttemptDetails()
  }

  const saveBulkGrades = async () => {
    if (!attemptId) return

    const gradings = manualAnswers
      .map((answer) => {
        const questionId = getQuestionId(answer)
        const draft = drafts[String(questionId)]
        const maxPoints = getQuestionPoints(answer)
        const awardedPoints = Number(draft?.awarded_points)

        if (
          !draft?.awarded_points ||
          !Number.isFinite(awardedPoints) ||
          awardedPoints < 0 ||
          awardedPoints > maxPoints
        ) {
          return null
        }

        return {
          question_id: questionId,
          awarded_points: awardedPoints,
          reviewer_note: draft.reviewer_note.trim() || null,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    if (gradings.length === 0) {
      showErrorToast(t("tests.noBulkGrades"))
      return
    }

    await bulkGradeMutation.mutateAsync({
      attemptId,
      input: { gradings },
    })
    await loadAttemptDetails()
  }

  const downloadAnswerFile = async (answer: TestAttemptResultBreakdownItem) => {
    if (!attemptId) return

    const questionId = getQuestionId(answer)
    setDownloadingQuestionId(questionId)
    try {
      const blob = await employerTestsService.downloadAnswerFile(attemptId, questionId)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = answer.file?.original_name ?? `answer-${questionId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showSuccessToast(t("tests.toasts.fileDownloaded"))
    } catch (error) {
      showErrorToast(error, t("tests.fileDownloadError"))
    } finally {
      setDownloadingQuestionId(null)
    }
  }

  const isGradingBusy =
    gradeMutation.isPending ||
    deleteGradeMutation.isPending ||
    bulkGradeMutation.isPending

  // Load details when component mounts or attempt changes
  useState(() => {
    loadAttemptDetails()
  })

  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{t("tests.gradingTitle")}</h3>
          <p className="text-sm text-text-muted">
            {attempt.test?.title || t("tests.untitled")}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          {t("tests.closeGrading")}
        </Button>
      </div>

      {loadingDetails ? (
        <div className="space-y-3">
          <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.gradingStatus")}</p>
              <p className="mt-1 font-medium">
                {valueOf(result?.grading_status ?? attempt.status, "-")}
              </p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.currentScore")}</p>
              <p className="mt-1 font-medium">
                {resultScore == null ? "-" : resultScore} / {resultMax}
              </p>
            </div>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{t("tests.manualProgress")}</p>
              <p className="mt-1 font-medium">
                {result?.manual_grading_progress
                  ? `${result.manual_grading_progress.graded}/${result.manual_grading_progress.total}`
                  : `${manualAnswers.filter((answer) => answer.awarded_points != null).length}/${manualAnswers.length}`}
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
                const draft = drafts[String(questionId)] ?? {
                  awarded_points: "",
                  reviewer_note: "",
                }
                const maxPoints = getQuestionPoints(answer)
                const manual = canManuallyGrade(answer)
                const questionType = answer.question_type

                return (
                  <div
                    key={questionId}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {index + 1}. {answer.question_text ?? t("tests.unknownQuestion")}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {valueOf(questionType, "-")} - {maxPoints} {t("tests.points")}
                        </p>
                      </div>
                      {answer.awarded_points != null && (
                        <StatusBadge status="reviewed" variant="soft" size="sm" />
                      )}
                    </div>

                    <div className="mt-3 rounded-md bg-muted/40 p-3">
                      <p className="mb-1 text-xs font-medium text-text-muted">
                        {t("tests.candidateAnswer")}
                      </p>
                      <p className="whitespace-pre-wrap text-sm">
                        {getSelectedAnswer(answer)}
                      </p>
                      {answer.file?.download_available && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          disabled={downloadingQuestionId === questionId}
                          onClick={() => void downloadAnswerFile(answer)}
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
                          <Label htmlFor={`grade-${questionId}`}>
                            {t("tests.awardedPoints", { max: maxPoints })}
                          </Label>
                          <Input
                            id={`grade-${questionId}`}
                            type="number"
                            min={0}
                            max={maxPoints}
                            step={0.5}
                            value={draft.awarded_points}
                            onChange={(event) =>
                              updateDraft(questionId, "awarded_points", event.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`note-${questionId}`}>
                            {t("tests.reviewerNote")}
                          </Label>
                          <Textarea
                            id={`note-${questionId}`}
                            rows={2}
                            value={draft.reviewer_note}
                            onChange={(event) =>
                              updateDraft(questionId, "reviewer_note", event.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            disabled={isGradingBusy}
                            onClick={() => void saveAnswerGrade(answer)}
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
                            onClick={() => void deleteAnswerGrade(answer)}
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
                          : t("tests.autoGradeResult", {
                              score: answer.awarded_points,
                              max: maxPoints,
                            })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadAttemptDetails()}
            >
              <RotateCcw className="h-4 w-4" /> {t("tests.refreshResult")}
            </Button>
            <Button
              type="button"
              disabled={manualAnswers.length === 0 || isGradingBusy}
              onClick={() => void saveBulkGrades()}
            >
              {bulkGradeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t("tests.bulkSave")}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
