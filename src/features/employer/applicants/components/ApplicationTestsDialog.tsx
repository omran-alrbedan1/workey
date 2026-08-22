import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CalendarClock,
  History,
  Download,
  FileText,
  ListChecks,
  Loader2,
  RotateCcw,
  Save,
  Send,
  Trash2,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { StatusBadge } from "@/components/shared/badges"
import { keyOf, valueOf } from "@/lib/keyValue"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ROUTES } from "@/config"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import { useApplicationTests } from "../hooks/useApplicationTests"
import { candidateDisplayName } from "../utils/candidateDisplay"
import { getAllowedApplicationActions } from "../utils/applicationActions"
import TestAssignmentDeadlinePanel from "./TestAssignmentDeadlinePanel"
import TestAssignmentRetakePanel from "./TestAssignmentRetakePanel"
import type { EmployerApplicant, EmployerTestAttempt } from "../types/employerApplicants.types"
import type {
  TestAttemptResult,
  TestAttemptResultBreakdownItem,
} from "@/features/employer/tests/types/employerTests.types"

type GradeDraft = {
  awarded_points: string
  reviewer_note: string
}

const manualQuestionTypes = new Set([
  "short_text",
  "long_text",
  "file_upload",
])

const nextSteps = [
  { value: "interview_pending", labelKey: "statuses.interview_pending" },
  { value: "final_review", labelKey: "statuses.final_review" },
  { value: "on_hold", labelKey: "statuses.on_hold" },
  { value: "rejected", labelKey: "statuses.rejected" },
] as const

function attemptId(attempt: EmployerTestAttempt) {
  return attempt.attempt?.id ?? null
}

function assignmentId(attempt: EmployerTestAttempt) {
  return attempt.id
}

function assignmentDeadline(attempt: EmployerTestAttempt): string | null {
  return attempt.effective_deadline_at ?? attempt.deadline_at ?? null
}

function formatDeadline(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function attemptScore(attempt: EmployerTestAttempt | null): number | null {
  if (!attempt) return null
  return attempt.attempt?.total_score ?? attempt.attempt?.score ?? null
}

function attemptMaxScore(attempt: EmployerTestAttempt | null): number {
  if (!attempt) return 0
  return attempt.attempt?.max_score ?? Number(attempt.test?.max_score ?? 0)
}

function getQuestionId(answer: TestAttemptResultBreakdownItem) {
  return answer.question_id
}

function getQuestionPoints(answer: TestAttemptResultBreakdownItem) {
  return Number(answer.max_points ?? 0)
}

function getSelectedAnswer(answer: TestAttemptResultBreakdownItem) {
  if (answer.answer_text) return answer.answer_text

  if (answer.selected_options.length > 0) {
    return answer.selected_options.map((option) => option.option_text).join(", ")
  }
  if (answer.file?.original_name) return answer.file.original_name
  return "-"
}

function getResultScore(result: TestAttemptResult | null) {
  if (!result) return null
  return result.total_score ?? null
}

function getResultMax(result: TestAttemptResult | null, fallback: number) {
  if (!result) return fallback
  return result.max_score ?? fallback
}

function canManuallyGrade(answer: TestAttemptResultBreakdownItem) {
  return manualQuestionTypes.has(answer.question_type.key)
}

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
  const navigate = useNavigate()
  const tests = useApplicationTests(application?.id)
  const allowedNextSteps = useMemo(() => {
    const targets = getAllowedApplicationActions(application).statusTargets
    return nextSteps.filter((step) => targets.includes(step.value))
  }, [application])
  const [gradingAttempt, setGradingAttempt] = useState<EmployerTestAttempt | null>(null)
  const [deadlineAttempt, setDeadlineAttempt] = useState<EmployerTestAttempt | null>(null)
  const [retakeAttempt, setRetakeAttempt] = useState<EmployerTestAttempt | null>(null)
  const [answers, setAnswers] = useState<TestAttemptResultBreakdownItem[]>([])
  const [result, setResult] = useState<TestAttemptResult | null>(null)
  const [drafts, setDrafts] = useState<Record<string, GradeDraft>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({})
  const [downloadingQuestionId, setDownloadingQuestionId] = useState<string | number | null>(null)
  const [nextStep, setNextStep] = useState("")
  const [nextStepLoading, setNextStepLoading] = useState(false)

  const gradingAttemptId = gradingAttempt ? attemptId(gradingAttempt) : null

  const manualAnswers = useMemo(
    () => answers.filter(canManuallyGrade),
    [answers],
  )

  const hasAnyResult = tests.data?.items.some((assignment) => assignment.attempt?.total_score != null) || Boolean(result)
  const activeMaxScore = attemptMaxScore(gradingAttempt)
  const resultScore = getResultScore(result)
  const resultMax = getResultMax(result, activeMaxScore)

  const resetGrading = () => {
    setGradingAttempt(null)
    setAnswers([])
    setResult(null)
    setDrafts({})
    setDownloadingQuestionId(null)
  }

  const loadAttemptDetails = async (attempt: EmployerTestAttempt) => {
    const id = attemptId(attempt)
    if (!id) return

    setLoadingDetails(true)
    try {
      const nextResult = await employerTestsService.getAttemptResult(id)
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

  useEffect(() => {
    if (!open) {
      resetGrading()
      setDeadlineAttempt(null)
      setRetakeAttempt(null)
      setShowAnswers({})
      setNextStep("")
    }
  }, [open])

  useEffect(() => {
    if (gradingAttempt) {
      void loadAttemptDetails(gradingAttempt)
    }
  }, [gradingAttempt])

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

  const saveAnswerGrade = async (answer: TestAttemptAnswer) => {
    if (!gradingAttemptId) return
    const questionId = getQuestionId(answer)
    const draft = drafts[String(questionId)]
    const maxPoints = getQuestionPoints(answer)
    const awardedPoints = Number(draft?.awarded_points)

    if (!Number.isFinite(awardedPoints) || awardedPoints < 0 || awardedPoints > maxPoints) {
      showErrorToast(t("tests.invalidGrade"))
      return
    }

    await tests.gradeMutation.mutateAsync({
      attemptId: gradingAttemptId,
      questionId,
      mode: answer.graded_at == null ? "create" : "update",
      input: {
        awarded_points: awardedPoints,
        reviewer_note: draft?.reviewer_note?.trim() || null,
      },
    })
    await loadAttemptDetails(gradingAttempt!)
  }

  const deleteAnswerGrade = async (answer: TestAttemptAnswer) => {
    if (!gradingAttemptId) return
    await tests.deleteGradeMutation.mutateAsync({
      attemptId: gradingAttemptId,
      questionId: getQuestionId(answer),
    })
    await loadAttemptDetails(gradingAttempt!)
  }

  const saveBulkGrades = async () => {
    if (!gradingAttemptId || !gradingAttempt) return

    const gradings = manualAnswers
      .map((answer) => {
        const questionId = getQuestionId(answer)
        const draft = drafts[String(questionId)]
        const maxPoints = getQuestionPoints(answer)
        const awardedPoints = Number(draft?.awarded_points)

        if (!draft?.awarded_points || !Number.isFinite(awardedPoints) || awardedPoints < 0 || awardedPoints > maxPoints) {
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

    await tests.bulkGradeMutation.mutateAsync({
      attemptId: gradingAttemptId,
      input: { gradings },
    })
    await loadAttemptDetails(gradingAttempt)
  }

  const downloadAnswerFile = async (answer: TestAttemptAnswer) => {
    if (!gradingAttemptId) return

    const questionId = getQuestionId(answer)
    setDownloadingQuestionId(questionId)
    try {
      const blob = await employerTestsService.downloadAnswerFile(gradingAttemptId, questionId)
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

  const handleNextStep = async () => {
    if (!application || !nextStep) return
    setNextStepLoading(true)
    try {
      await onNextStep?.(application.id, nextStep)
    } finally {
      setNextStepLoading(false)
    }
  }

  const isGradingBusy =
    tests.gradeMutation.isPending ||
    tests.deleteGradeMutation.isPending ||
    tests.bulkGradeMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("tests.title")}</DialogTitle>
          <DialogDescription>{candidateDisplayName(application, t("unknownCandidate"))}</DialogDescription>
        </DialogHeader>

        {tests.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : tests.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {t("tests.loadError")}
            <Button variant="link" onClick={() => void tests.refetch()}>
              {t("tests.retry")}
            </Button>
          </div>
        ) : tests.data?.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">{t("tests.empty")}</p>
        ) : (
          <div className="space-y-4">
            {tests.data?.items.map((attempt) => {
              const id = attemptId(attempt)
              const score = attemptScore(attempt)
              const max = attemptMaxScore(attempt)
              const passed = attempt.attempt?.is_passing_score_met
              const attemptStatusKey = keyOf(attempt.state)
              const submitted = Boolean(attempt.attempt?.submitted_at) || attemptStatusKey === "submitted" || attemptStatusKey === "evaluated"
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
                      <p className="mt-1 text-xs text-text-muted">
                        {t("tests.maxScore", { score: max })}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {t("tests.deadlineLabel", { deadline: formatDeadline(deadline) })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={
                          score != null
                            ? passed
                              ? "completed"
                              : "reviewed"
                            : attemptStatusKey || "pending"
                        }
                        variant="soft"
                      />
                      {submitted && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setGradingAttempt(attempt)}>
                            <CheckCircle2 className="h-4 w-4" /> {t("tests.gradeAnswers")}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const currentAttemptId = attemptId(attempt)
                              const currentTestId = attempt.test?.id ?? currentAttemptId
                              if (currentAttemptId) {
                                navigate(ROUTES.employer.testAttemptGrading(currentTestId, currentAttemptId))
                              }
                            }}
                          >
                            <FileText className="h-4 w-4" /> {t("tests.openGradingPage")}
                          </Button>
                        </>
                      )}
                      {assignment && (
                        <Button size="sm" variant="outline" onClick={() => setDeadlineAttempt(attempt)}>
                          <CalendarClock className="h-4 w-4" /> {t("tests.manageDeadline")}
                        </Button>
                      )}
                      {assignment && (
                        <Button size="sm" variant="outline" onClick={() => setRetakeAttempt(attempt)}>
                          <History className="h-4 w-4" /> {t("tests.manageRetakes")}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() =>
                          setShowAnswers((prev) => ({
                            ...prev,
                            [String(id)]: !prev[String(id)],
                          }))
                        }
                      >
                        <ListChecks className="h-4 w-4" />
                        {isOpen ? t("tests.hideDetails") : t("tests.showDetails")}
                        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  {score != null && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">
                        {t("tests.result", { score, max })}
                      </p>
                      {attempt.feedback && (
                        <p className="text-sm text-text-muted">
                          <span className="font-medium">{t("tests.feedback")}:</span>{" "}
                          {attempt.feedback}
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
        )}

        {deadlineAttempt && assignmentId(deadlineAttempt) && (
          <TestAssignmentDeadlinePanel
            assignmentId={assignmentId(deadlineAttempt)!}
            currentDeadline={assignmentDeadline(deadlineAttempt)}
            testTitle={deadlineAttempt.test?.title}
            onClose={() => setDeadlineAttempt(null)}
            onUpdated={async () => {
              await tests.refetch()
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
              await tests.refetch()
            }}
          />
        )}

        {gradingAttempt && (
          <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{t("tests.gradingTitle")}</h3>
                <p className="text-sm text-text-muted">
                  {gradingAttempt.test?.title || t("tests.untitled")}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={resetGrading}>
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
                  <p className="rounded-md border border-border bg-background p-4 text-sm text-text-muted">
                    {t("tests.noAnswers")}
                  </p>
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
                            {answer.awarded_points != null && (
                              <StatusBadge status="reviewed" variant="soft" size="sm" />
                            )}
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
                                <Label htmlFor={`note-${questionId}`}>{t("tests.reviewerNote")}</Label>
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
                  <Button type="button" variant="outline" onClick={() => void loadAttemptDetails(gradingAttempt)}>
                    <RotateCcw className="h-4 w-4" /> {t("tests.refreshResult")}
                  </Button>
                  <Button
                    type="button"
                    disabled={manualAnswers.length === 0 || isGradingBusy}
                    onClick={() => void saveBulkGrades()}
                  >
                    {tests.bulkGradeMutation.isPending ? (
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
        )}

        {hasAnyResult && onNextStep && allowedNextSteps.length > 0 && (
          <div className="rounded-lg border border-border bg-background p-4">
            <h3 className="mb-3 font-semibold">{t("tests.nextStep")}</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={nextStep} onValueChange={setNextStep}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("tests.selectNextStep")} />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedNextSteps.map((step) => (
                      <SelectItem key={step.value} value={step.value}>
                        {t(step.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={!nextStep || nextStepLoading}
                onClick={() => void handleNextStep()}
              >
                <Send className="h-4 w-4" /> {t("tests.applyNextStep")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
