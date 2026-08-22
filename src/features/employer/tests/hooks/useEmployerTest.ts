import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "../services/employerTests.service"
import type { EmployerTest, EmployerTestInput } from "../types/employerTests.types"

export function useEmployerTest(id?: string | number) {
  const { t } = useTranslation("employerTests")
  const client = useQueryClient()

  const testQuery = useQuery({
    queryKey: ["employer", "tests", "detail", String(id ?? "")],
    queryFn: () => employerTestsService.get(id!),
    enabled: Boolean(id),
  })

  const questionsQuery = useQuery({
    queryKey: ["employer", "tests", "questions", String(id ?? "")],
    queryFn: () => employerTestsService.getQuestions(id!),
    enabled: Boolean(id),
    retry: false,
  })

  const hasFetchedQuestions =
    questionsQuery.isSuccess && questionsQuery.data && questionsQuery.data.length > 0
  const data: EmployerTest | undefined = testQuery.data
    ? {
        ...testQuery.data,
        questions: hasFetchedQuestions ? questionsQuery.data : testQuery.data.questions,
      }
    : undefined

  const updateMutation = useMutation({
    mutationFn: (input: EmployerTestInput) => employerTestsService.update(id!, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "tests"] })
      showSuccessToast(t("toasts.updated"))
    },
  })

  return {
    ...testQuery,
    data,
    isPending: testQuery.isPending || questionsQuery.isPending,
    refetch: () => {
      testQuery.refetch()
      questionsQuery.refetch()
    },
    updateMutation,
  }
}
