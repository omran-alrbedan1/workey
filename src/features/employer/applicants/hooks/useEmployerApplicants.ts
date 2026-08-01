import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type {
  EmployerApplicantStatusInput,
  EmployerInterviewInput,
} from "../types/employerApplicants.types"

export function useEmployerApplicants(jobId?: string | number) {
  const { t } = useTranslation("employerApplicants")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const rootKey = ["employer", "applicants", String(jobId ?? "")] as const
  const query = useQuery({
    queryKey: [...rootKey, page],
    queryFn: () => employerApplicantsService.list(jobId!, page),
    enabled: Boolean(jobId),
  })
  const statusMutation = useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string | number
      input: EmployerApplicantStatusInput
    }) => employerApplicantsService.updateStatus(applicationId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: rootKey })
      showSuccessToast(t("toasts.statusUpdated"))
    },
  })
  const scheduleInterviewMutation = useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string | number
      input: EmployerInterviewInput
    }) => employerApplicantsService.scheduleInterview(applicationId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: rootKey })
      showSuccessToast(t("toasts.interviewScheduled"))
    },
  })

  return { ...query, page, setPage, statusMutation, scheduleInterviewMutation }
}
