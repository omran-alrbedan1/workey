import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerInterviewsService } from "../services/employerInterviews.service"
import type { EmployerInterviewInput } from "../types/employerInterviews.types"

export function useCreateEmployerInterview() {
  const { t } = useTranslation("employerInterviews")
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string | number
      input: EmployerInterviewInput
    }) => employerInterviewsService.create(applicationId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["employer", "interviews"] })
      showSuccessToast(t("toasts.created"))
    },
  })
}
