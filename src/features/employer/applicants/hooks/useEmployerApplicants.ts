import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerApplicantsService } from "../services/employerApplicants.service"
import type {
  ApplicationStatusChangeInput,
  EmployerInterviewInput,
} from "../types/employerApplicants.types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function apiErrorCode(error: unknown) {
  if (!isRecord(error)) return undefined
  const response = isRecord(error.response) ? error.response : undefined
  const data = response && isRecord(response.data) ? response.data : undefined
  return (error.code ?? data?.code) as string | undefined
}

export function useEmployerApplicants(jobId?: string | number) {
  const { t } = useTranslation("employerApplicants")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const rootKey = ["employer", "applicants", String(jobId ?? "")] as const
  const query = useQuery({
    queryKey: [...rootKey, page],
    queryFn: () => employerApplicantsService.list(jobId!, page),
    enabled: Boolean(jobId),
    placeholderData: keepPreviousData,
  })
  const statusMutation = useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: string | number
      input: ApplicationStatusChangeInput
    }) => employerApplicantsService.updateStatus(applicationId, input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: rootKey })
      showSuccessToast(t("toasts.statusUpdated"))
    },
    onError: (error: unknown) => {
      const message =
        (isRecord(error) &&
          ((isRecord(error.response) &&
            isRecord(error.response.data) &&
            (error.response.data.message as string | undefined)) ||
            (error.message as string | undefined))) ||
        "Failed to update status"
      const code = apiErrorCode(error)
      if (code === "INVALID_STATUS_TRANSITION") {
        showErrorToast(t("errors.invalidTransition"))
      } else if (code === "TERMINAL_STATE") {
        showErrorToast(t("errors.terminalState"))
      } else {
        showErrorToast(message)
      }
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
