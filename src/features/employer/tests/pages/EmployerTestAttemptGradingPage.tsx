import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, Download, Save, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ROUTES } from "@/config"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "../services/employerTests.service"
import type { TestAttemptAnswer } from "../types/employerTests.types"

type GradeDraft = Record<string, { awarded_points: string; reviewer_note: string }>

function answerText(answer: TestAttemptAnswer): string {
  if (answer.answer_text) return answer.answer_text
  if (answer.selected_option_ids?.length) return answer.selected_option_ids.join(", ")
  if (answer.uploaded_file?.file_name) return answer.uploaded_file.file_name
  return "-"
}

export default function EmployerTestAttemptGradingPage() {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const client = useQueryClient()
  const { id, attemptId } = useParams()
  const [drafts, setDrafts] = useState<GradeDraft>({})
  const queryKey = ["employer", "tests", String(id ?? ""), "attempts", String(attemptId ?? ""), "grading"]

  const answers = useQuery({
    queryKey: [...queryKey, "answers"],
    queryFn: () => employerTestsService.getAttemptAnswers(attemptId!),
    enabled: Boolean(attemptId),
  })

  const result = useQuery({
    queryKey: [...queryKey, "result"],
    queryFn: () => employerTestsService.getAttemptResult(attemptId!),
    enabled: Boolean(attemptId),
  })

  const manualAnswers = useMemo(
    () =>
      (answers.data ?? []).filter((answer) =>
        ["short_text", "long_text", "essay", "file_upload"].includes(
          answer.question?.question_type ?? "",
        ),
      ),
    [answers.data],
  )

  useEffect(() => {
    const next: GradeDraft = {}
    for (const answer of manualAnswers) {
      next[String(answer.question_id)] = {
        awarded_points:
          answer.awarded_points === null || answer.awarded_points === undefined
            ? ""
            : String(answer.awarded_points),
        reviewer_note: answer.reviewer_note ?? "",
      }
    }
    setDrafts(next)
  }, [manualAnswers])

  const invalidate = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: [...queryKey, "answers"] }),
      client.invalidateQueries({ queryKey: [...queryKey, "result"] }),
    ])
  }

  const gradeMutation = useMutation({
    mutationFn: ({
      questionId,
      answer,
    }: {
      questionId: string | number
      answer: TestAttemptAnswer
    }) => {
      const draft = drafts[String(questionId)]
      return employerTestsService[answer.graded_at ? "updateAnswerGrade" : "gradeAnswer"](
        attemptId!,
        questionId,
        {
          awarded_points: Number(draft?.awarded_points ?? 0),
          reviewer_note: draft?.reviewer_note || null,
        },
      )
    },
    onSuccess: async () => {
      await invalidate()
      showSuccessToast(t("tests.toasts.graded"))
    },
    onError: (error) => showErrorToast(error, t("tests.gradingLoadError")),
  })

  const deleteGradeMutation = useMutation({
    mutationFn: (questionId: string | number) =>
      employerTestsService.removeAnswerGrade(attemptId!, questionId),
    onSuccess: async () => {
      await invalidate()
      showSuccessToast(t("tests.toasts.gradeRemoved"))
    },
    onError: (error) => showErrorToast(error, t("tests.gradingLoadError")),
  })

  const bulkGradeMutation = useMutation({
    mutationFn: () =>
      employerTestsService.bulkGradeAnswers(attemptId!, {
        gradings: manualAnswers
          .map((answer) => {
            const draft = drafts[String(answer.question_id)]
            return {
              question_id: answer.question_id,
              awarded_points: Number(draft?.awarded_points ?? Number.NaN),
              reviewer_note: draft?.reviewer_note || null,
            }
          })
          .filter((grade) => Number.isFinite(grade.awarded_points)),
      }),
    onSuccess: async () => {
      await invalidate()
      showSuccessToast(t("tests.toasts.bulkGraded"))
    },
    onError: (error) => showErrorToast(error, t("tests.gradingLoadError")),
  })

  const downloadFile = async (questionId: string | number, fileName?: string) => {
    try {
      const blob = await employerTestsService.downloadAnswerFile(attemptId!, questionId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || `answer-${questionId}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSuccessToast(t("tests.toasts.fileDownloaded"))
    } catch (error) {
      showErrorToast(error, t("tests.fileDownloadError"))
    }
  }

  if (answers.isError || result.isError) {
    return (
      <ErrorState
        title={t("tests.gradingTitle")}
        description={t("tests.gradingLoadError")}
        retry={() => {
          void answers.refetch()
          void result.refetch()
        }}
      />
    )
  }

  const isPending = gradeMutation.isPending || deleteGradeMutation.isPending || bulkGradeMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("tests.gradingPageTitle")}
        description={t("tests.gradingPageDescription", { attempt: attemptId })}
        icon={CheckCircle2}
        showBackButton
        backButtonLabel={t("tests.backToTests")}
        onBackClick={() => navigate(ROUTES.employer.tests)}
      />

      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-text-muted">{t("tests.gradingStatus")}</p>
            <p className="font-medium">{result.data?.grading_status ?? result.data?.status ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">{t("tests.currentScore")}</p>
            <p className="font-medium">
              {result.data?.total_score ?? result.data?.awarded_points ?? "-"} /{" "}
              {result.data?.max_score ?? result.data?.total_points ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">{t("tests.manualProgress")}</p>
            <p className="font-medium">
              {result.data?.manual_grading
                ? `${result.data.manual_grading.graded}/${result.data.manual_grading.total}`
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {answers.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      ) : manualAnswers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-text-muted">
            {t("tests.noAnswers")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {manualAnswers.map((answer, index) => {
            const questionId = answer.question_id
            const maxPoints = answer.question?.points ?? 0
            const draft = drafts[String(questionId)] ?? { awarded_points: "", reviewer_note: "" }

            return (
              <Card key={String(questionId)}>
                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="font-medium text-text-primary">
                      {index + 1}. {answer.question?.question_text ?? t("tests.unknownQuestion")}
                    </p>
                    <p className="text-xs text-text-muted">
                      {answer.question?.question_type ?? "-"} - {maxPoints} {t("tests.points")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-3 text-sm">
                    <p className="mb-1 text-xs font-medium text-text-muted">{t("tests.candidateAnswer")}</p>
                    <p className="whitespace-pre-wrap text-text-secondary">{answerText(answer)}</p>
                    {answer.uploaded_file && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => void downloadFile(questionId, answer.uploaded_file?.file_name)}
                      >
                        <Download className="h-4 w-4" />
                        {answer.uploaded_file.file_name ?? t("tests.downloadFile")}
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`points-${questionId}`}>
                        {t("tests.awardedPoints", { max: maxPoints })}
                      </Label>
                      <Input
                        id={`points-${questionId}`}
                        type="number"
                        min={0}
                        max={maxPoints}
                        value={draft.awarded_points}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [String(questionId)]: {
                              ...draft,
                              awarded_points: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`note-${questionId}`}>{t("tests.reviewerNote")}</Label>
                      <Textarea
                        id={`note-${questionId}`}
                        value={draft.reviewer_note}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [String(questionId)]: {
                              ...draft,
                              reviewer_note: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        disabled={isPending}
                        onClick={() => gradeMutation.mutate({ questionId, answer })}
                        aria-label={t("tests.saveGrade")}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      {answer.graded_at && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => deleteGradeMutation.mutate(questionId)}
                          aria-label={t("tests.deleteGrade")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <div className="flex justify-end">
            <Button type="button" disabled={isPending} onClick={() => bulkGradeMutation.mutate()}>
              <Save className="h-4 w-4" />
              {t("tests.bulkSave")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
