import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerTestsService } from "../services/employerTests.service"
import type { AssignTestPayload, EmployerTestInput } from "../types/employerTests.types"

const key = ["employer", "tests"] as const

export function useEmployerTests() {
  const { t } = useTranslation("employerTests")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const query = useQuery({
    queryKey: [...key, page],
    queryFn: () => employerTestsService.list(page),
  })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const createMutation = useMutation({
    mutationFn: employerTestsService.create,
    onSuccess: async (data) => {
      await refresh()
      showSuccessToast(t("toasts.created"))
      return data
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: EmployerTestInput }) =>
      employerTestsService.update(id, input),
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.updated"))
    },
  })
  const patchMutation = useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: Partial<EmployerTestInput> }) =>
      employerTestsService.patch(id, input),
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.updated"))
    },
  })
  const deleteMutation = useMutation({
    mutationFn: employerTestsService.remove,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.deleted"))
    },
  })
  const assignMutation = useMutation({
    mutationFn: ({
      applicationId,
      testId,
      deadline_at,
      max_attempts,
      instructions,
      note,
    }: {
      applicationId: string | number
      testId: string | number
    } & Omit<AssignTestPayload, "test_id">) =>
      employerTestsService.assignTest(applicationId, testId, note, {
        deadline_at,
        max_attempts,
        instructions,
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "applicants"] })
      showSuccessToast(t("toasts.assigned"))
    },
  })

  return {
    ...query,
    page,
    setPage,
    createMutation,
    updateMutation,
    patchMutation,
    deleteMutation,
    assignMutation,
  }
}
