import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { employerApplicantsService } from "../services/employerApplicants.service"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import type { ApplicationStatusChangeInput } from "../types/employerApplicants.types"

export function useEmployerApplicantDetail(applicationId?: string | number) {
  return useQuery({
    queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")],
    queryFn: () => employerApplicantsService.getById(applicationId!),
    enabled: Boolean(applicationId),
  })
}

export function useDownloadCv() {
  return async (applicationId: string | number) => {
    const blob = await employerApplicantsService.downloadSelectedCv(applicationId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cv-${applicationId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export function usePreviewCv() {
  return async (applicationId: string | number) => {
    const blob = await employerApplicantsService.previewSelectedCv(applicationId)
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
}

export function useApplicationStatusMutation(applicationId?: string | number) {
  const { t } = useTranslation("employerApplicants")
  const client = useQueryClient()

  return useMutation({
    mutationFn: (input: ApplicationStatusChangeInput) =>
      employerApplicantsService.updateStatus(applicationId!, input),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["employer", "applicants"] }),
        client.invalidateQueries({ queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")] }),
        client.invalidateQueries({ queryKey: ["application-interviews", applicationId] }),
        client.invalidateQueries({ queryKey: ["employer", "applications", String(applicationId ?? ""), "tests"] }),
        client.invalidateQueries({ queryKey: ["internalNotes", applicationId] }),
      ])
      showSuccessToast(t("toasts.statusUpdated"))
    },
    onError: (error: { message?: string; code?: string; statusCode?: number }) => {
      if (error.code === "INVALID_STATUS_TRANSITION") {
        showErrorToast(t("errors.invalidTransition"))
      } else if (error.code === "TERMINAL_STATE") {
        showErrorToast(t("errors.terminalState"))
      } else {
        showErrorToast(error.message || t("errors.description"))
      }
      void client.invalidateQueries({ queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")] })
    },
  })
}
