import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "@/config"
import { keyOf } from "@/lib/keyValue"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import {
  attemptId,
  attemptMaxScore,
  attemptScore,
  canManuallyGrade,
  type GradeDraft,
} from "../components/test-details/testDetails.helpers"
import { useApplicationStatusMutation } from "./useEmployerApplicantDetail"
import { useApplicationTests } from "./useApplicationTests"
import type { ApplicationStatusKey, EmployerTestAttempt } from "../types/employerApplicants.types"
import type { TestAttemptResult, TestAttemptResultBreakdownItem } from "@/features/employer/tests/types/employerTests.types"

export type ApplicantTestDetailsState = "loading" | "error" | "not-found" | "ready"

export interface ApplicantTestDetailsModel {
  state: ApplicantTestDetailsState
  applicantId?: string
  assignment: EmployerTestAttempt | null
  activeTab: string
  activeAttemptId: string | number | null
  answers: TestAttemptResultBreakdownItem[]
  drafts: Record<string, GradeDraft>
  loadingDetails: boolean
  submitted: boolean
  downloadingQuestionId: string | number | null
  score: number | null
  maxScore: number
  hasAnyResult: boolean
  isGradingBusy: boolean
  isBulkSaving: boolean
  isStatusPending: boolean
  manualAnswersCount: number
  nextStep: string
  setActiveTab: (tab: string) => void
  setNextStep: (step: string) => void
  goBack: () => void
  refetchTests: () => Promise<unknown>
  loadAttemptDetails: () => Promise<void>
  updateDraft: (questionId: string | number, field: keyof GradeDraft, value: string) => void
  saveAnswerGrade: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  deleteAnswerGrade: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  saveBulkGrades: () => Promise<void>
  downloadAnswerFile: (answer: TestAttemptResultBreakdownItem) => Promise<void>
  applyNextStep: () => Promise<void>
}

export function useApplicantTestDetailsPage(): ApplicantTestDetailsModel {
  const { t } = useTranslation("employerApplicants")
  const navigate = useNavigate()
  const { id, assignmentId } = useParams()
  const tests = useApplicationTests(id)
  const statusMutation = useApplicationStatusMutation(id)
  const [result, setResult] = useState<TestAttemptResult | null>(null)
  const [answers, setAnswers] = useState<TestAttemptResultBreakdownItem[]>([])
  const [drafts, setDrafts] = useState<Record<string, GradeDraft>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [downloadingQuestionId, setDownloadingQuestionId] = useState<string | number | null>(null)
  const [nextStep, setNextStep] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const assignment = tests.data?.items.find((item) => String(item.id) === String(assignmentId)) ?? null
  const activeAttemptId = attemptId(assignment)
  const score = result?.total_score ?? attemptScore(assignment)
  const maxScore = result?.max_score ?? attemptMaxScore(assignment)
  const manualAnswers = useMemo(() => answers.filter(canManuallyGrade), [answers])
  const state = getState(tests.isPending, tests.isError, assignment)
  const assignmentStatusKey = keyOf(assignment?.state)
  const submitted =
    Boolean(assignment?.attempt?.submitted_at) ||
    assignmentStatusKey === "submitted" ||
    assignmentStatusKey === "evaluated"

  const isGradingBusy =
    tests.gradeMutation.isPending ||
    tests.deleteGradeMutation.isPending ||
    tests.bulkGradeMutation.isPending

  const goBack = useCallback(() => {
    navigate(id ? ROUTES.employer.applicantDetails(id) : ROUTES.employer.applicants)
  }, [id, navigate])

  const loadAttemptDetails = useCallback(async () => {
    if (!activeAttemptId) return

    setLoadingDetails(true)
    try {
      const nextResult = await employerTestsService.getAttemptResult(activeAttemptId)
      const nextAnswers = nextResult.breakdown ?? []
      setResult(nextResult)
      setAnswers(nextAnswers)
      setDrafts(createGradeDrafts(nextAnswers))
    } catch (error) {
      showErrorToast(error, t("tests.gradingLoadError"))
      setResult(null)
      setAnswers([])
      setDrafts({})
    } finally {
      setLoadingDetails(false)
    }
  }, [activeAttemptId, t])

  useEffect(() => {
    setResult(null)
    setAnswers([])
    setDrafts({})
    if (activeAttemptId) void loadAttemptDetails()
  }, [activeAttemptId, loadAttemptDetails])

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
    if (!activeAttemptId) return

    const draft = drafts[String(answer.question_id)]
    const awardedPoints = Number(draft?.awarded_points)
    const maxPoints = Number(answer.max_points ?? 0)

    if (!isValidGrade(awardedPoints, maxPoints)) {
      showErrorToast(t("tests.invalidGrade"))
      return
    }

    await tests.gradeMutation.mutateAsync({
      attemptId: activeAttemptId,
      questionId: answer.question_id,
      mode: answer.graded_at == null ? "create" : "update",
      input: {
        awarded_points: awardedPoints,
        reviewer_note: draft?.reviewer_note?.trim() || null,
      },
    })
    await loadAttemptDetails()
  }

  const deleteAnswerGrade = async (answer: TestAttemptResultBreakdownItem) => {
    if (!activeAttemptId) return

    await tests.deleteGradeMutation.mutateAsync({
      attemptId: activeAttemptId,
      questionId: answer.question_id,
    })
    await loadAttemptDetails()
  }

  const saveBulkGrades = async () => {
    if (!activeAttemptId) return

    const gradings = manualAnswers
      .map((answer) => buildBulkGrade(answer, drafts[String(answer.question_id)]))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    if (gradings.length === 0) {
      showErrorToast(t("tests.noBulkGrades"))
      return
    }

    await tests.bulkGradeMutation.mutateAsync({
      attemptId: activeAttemptId,
      input: { gradings },
    })
    await loadAttemptDetails()
  }

  const downloadAnswerFile = async (answer: TestAttemptResultBreakdownItem) => {
    if (!activeAttemptId) return

    setDownloadingQuestionId(answer.question_id)
    try {
      const blob = await employerTestsService.downloadAnswerFile(activeAttemptId, answer.question_id)
      downloadBlob(blob, answer.file?.original_name ?? `answer-${answer.question_id}`)
      showSuccessToast(t("tests.toasts.fileDownloaded"))
    } catch (error) {
      showErrorToast(error, t("tests.fileDownloadError"))
    } finally {
      setDownloadingQuestionId(null)
    }
  }

  const applyNextStep = async () => {
    if (!nextStep) return
    await statusMutation.mutateAsync({ status: nextStep as ApplicationStatusKey })
    setNextStep("")
  }

  return {
    state,
    applicantId: id,
    assignment,
    activeTab,
    activeAttemptId,
    answers,
    drafts,
    loadingDetails,
    submitted,
    downloadingQuestionId,
    score,
    maxScore,
    hasAnyResult: Boolean(score != null || result),
    isGradingBusy,
    isBulkSaving: tests.bulkGradeMutation.isPending,
    isStatusPending: statusMutation.isPending,
    manualAnswersCount: manualAnswers.length,
    nextStep,
    setActiveTab,
    setNextStep,
    goBack,
    refetchTests: tests.refetch,
    loadAttemptDetails,
    updateDraft,
    saveAnswerGrade,
    deleteAnswerGrade,
    saveBulkGrades,
    downloadAnswerFile,
    applyNextStep,
  }
}

function getState(
  isPending: boolean,
  isError: boolean,
  assignment: EmployerTestAttempt | null,
): ApplicantTestDetailsState {
  if (isPending) return "loading"
  if (isError) return "error"
  if (!assignment) return "not-found"
  return "ready"
}

function createGradeDrafts(answers: TestAttemptResultBreakdownItem[]) {
  return answers.reduce<Record<string, GradeDraft>>((acc, answer) => {
    acc[String(answer.question_id)] = {
      awarded_points: answer.awarded_points == null ? "" : String(answer.awarded_points),
      reviewer_note: answer.reviewer_note ?? "",
    }
    return acc
  }, {})
}

function isValidGrade(awardedPoints: number, maxPoints: number) {
  return Number.isFinite(awardedPoints) && awardedPoints >= 0 && awardedPoints <= maxPoints
}

function buildBulkGrade(answer: TestAttemptResultBreakdownItem, draft?: GradeDraft) {
  const awardedPoints = Number(draft?.awarded_points)
  const maxPoints = Number(answer.max_points ?? 0)

  if (!draft?.awarded_points || !isValidGrade(awardedPoints, maxPoints)) {
    return null
  }

  return {
    question_id: answer.question_id,
    awarded_points: awardedPoints,
    reviewer_note: draft.reviewer_note.trim() || null,
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
