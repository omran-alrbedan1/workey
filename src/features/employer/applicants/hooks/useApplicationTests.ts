import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerApplicantsService } from "../services/employerApplicants.service"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { EmployerTestEvaluationInput } from "../types/employerApplicants.types"
import type {
  BulkManualGradingInput,
  ManualGradingInput,
} from "@/features/employer/tests/types/employerTests.types"

export function useApplicationTests(applicationId?: string | number) {
  const { t } = useTranslation("employerApplicants")
  const client = useQueryClient()
  const key = ["employer", "applications", String(applicationId ?? ""), "tests"] as const
  const query = useQuery({
    queryKey: key,
    queryFn: () => employerApplicantsService.listTests(applicationId!),
    enabled: Boolean(applicationId),
  })
  const evaluateMutation = useMutation({
    mutationFn: ({
      attemptId,
      input,
    }: {
      attemptId: string | number
      input: EmployerTestEvaluationInput
    }) => employerApplicantsService.evaluateAttempt(attemptId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      showSuccessToast(t("tests.toasts.evaluated"))
    },
  })

  const gradeMutation = useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      input,
      mode,
    }: {
      attemptId: string | number
      questionId: string | number
      input: ManualGradingInput
      mode: "create" | "update"
    }) =>
      mode === "update"
        ? employerTestsService.updateAnswerGrade(attemptId, questionId, input)
        : employerTestsService.gradeAnswer(attemptId, questionId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      showSuccessToast(t("tests.toasts.graded"))
    },
  })

  const deleteGradeMutation = useMutation({
    mutationFn: ({
      attemptId,
      questionId,
    }: {
      attemptId: string | number
      questionId: string | number
    }) => employerTestsService.removeAnswerGrade(attemptId, questionId),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      showSuccessToast(t("tests.toasts.gradeRemoved"))
    },
  })

  const bulkGradeMutation = useMutation({
    mutationFn: ({
      attemptId,
      input,
    }: {
      attemptId: string | number
      input: BulkManualGradingInput
    }) => employerTestsService.bulkGradeAnswers(attemptId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key })
      showSuccessToast(t("tests.toasts.bulkGraded"))
    },
  })

  return {
    ...query,
    evaluateMutation,
    gradeMutation,
    deleteGradeMutation,
    bulkGradeMutation,
  }
}
