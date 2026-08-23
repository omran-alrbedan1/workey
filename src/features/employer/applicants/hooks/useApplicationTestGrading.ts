import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { EmployerTestAttempt } from "../types/employerApplicants.types"
import { useApplicationTests } from "./useApplicationTests"
import {
  attemptId,
  buildGradeDrafts,
  canManuallyGrade,
  getQuestionId,
  getQuestionPoints,
  type GradeDraft,
} from "../utils/applicationTests"
import type {
  TestAttemptResult,
  TestAttemptResultBreakdownItem,
} from "@/features/employer/tests/types/employerTests.types"

export function useApplicationTestGrading({
  applicationId,
  open,
}: {
  applicationId?: string | number
  open: boolean
}) {
  const { t } = useTranslation("employerApplicants")
  const tests = useApplicationTests(applicationId)
  const [gradingAttempt, setGradingAttempt] = useState<EmployerTestAttempt | null>(null)
  const [answers, setAnswers] = useState<TestAttemptResultBreakdownItem[]>([])
  const [result, setResult] = useState<TestAttemptResult | null>(null)
  const [drafts, setDrafts] = useState<Record<string, GradeDraft>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [downloadingQuestionId, setDownloadingQuestionId] = useState<string | number | null>(null)

  const gradingAttemptId = gradingAttempt ? attemptId(gradingAttempt) : null
  const manualAnswers = useMemo(() => answers.filter(canManuallyGrade), [answers])

  const resetGrading = useCallback(() => {
    setGradingAttempt(null)
    setAnswers([])
    setResult(null)
    setDrafts({})
    setDownloadingQuestionId(null)
  }, [])

  const loadAttemptDetails = useCallback(
    async (attempt: EmployerTestAttempt) => {
      const id = attemptId(attempt)
      if (!id) return

      setLoadingDetails(true)
      try {
        const nextResult = await employerTestsService.getAttemptResult(id)
        const nextAnswers = nextResult.breakdown ?? []
        setAnswers(nextAnswers)
        setResult(nextResult)
        setDrafts(buildGradeDrafts(nextAnswers))
      } catch (error) {
        showErrorToast(error, t("tests.gradingLoadError"))
        setAnswers([])
        setResult(null)
        setDrafts({})
      } finally {
        setLoadingDetails(false)
      }
    },
    [t],
  )

  useEffect(() => {
    if (!open) resetGrading()
  }, [open, resetGrading])

  useEffect(() => {
    if (gradingAttempt) void loadAttemptDetails(gradingAttempt)
  }, [gradingAttempt, loadAttemptDetails])

  const updateDraft = useCallback((questionId: string | number, field: keyof GradeDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [String(questionId)]: {
        awarded_points: current[String(questionId)]?.awarded_points ?? "",
        reviewer_note: current[String(questionId)]?.reviewer_note ?? "",
        [field]: value,
      },
    }))
  }, [])

  const saveAnswerGrade = useCallback(
    async (answer: TestAttemptResultBreakdownItem) => {
      if (!gradingAttemptId || !gradingAttempt) return
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
      await loadAttemptDetails(gradingAttempt)
    },
    [drafts, gradingAttempt, gradingAttemptId, loadAttemptDetails, t, tests.gradeMutation],
  )

  const deleteAnswerGrade = useCallback(
    async (answer: TestAttemptResultBreakdownItem) => {
      if (!gradingAttemptId || !gradingAttempt) return
      await tests.deleteGradeMutation.mutateAsync({
        attemptId: gradingAttemptId,
        questionId: getQuestionId(answer),
      })
      await loadAttemptDetails(gradingAttempt)
    },
    [gradingAttempt, gradingAttemptId, loadAttemptDetails, tests.deleteGradeMutation],
  )

  const saveBulkGrades = useCallback(async () => {
    if (!gradingAttemptId || !gradingAttempt) return

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

    await tests.bulkGradeMutation.mutateAsync({
      attemptId: gradingAttemptId,
      input: { gradings },
    })
    await loadAttemptDetails(gradingAttempt)
  }, [drafts, gradingAttempt, gradingAttemptId, loadAttemptDetails, manualAnswers, t, tests.bulkGradeMutation])

  const downloadAnswerFile = useCallback(
    async (answer: TestAttemptResultBreakdownItem) => {
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
    },
    [gradingAttemptId, t],
  )

  const isGradingBusy =
    tests.gradeMutation.isPending ||
    tests.deleteGradeMutation.isPending ||
    tests.bulkGradeMutation.isPending

  return {
    tests,
    gradingAttempt,
    answers,
    result,
    drafts,
    loadingDetails,
    downloadingQuestionId,
    gradingAttemptId,
    manualAnswers,
    isGradingBusy,
    setGradingAttempt,
    resetGrading,
    updateDraft,
    saveAnswerGrade,
    deleteAnswerGrade,
    saveBulkGrades,
    downloadAnswerFile,
    loadAttemptDetails,
  }
}
