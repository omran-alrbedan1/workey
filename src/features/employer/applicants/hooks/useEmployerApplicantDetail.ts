import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { employerApplicantsService } from "../services/employerApplicants.service"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import type { ApplicationStatusChangeInput, EmployerApplicant } from "../types/employerApplicants.types"
import { canDownloadCv, canPreviewCv, getApplicationCvDocument } from "../utils/cv"

export function useEmployerApplicantDetail(applicationId?: string | number) {
  return useQuery({
    queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")],
    queryFn: () => employerApplicantsService.getById(applicationId!),
    enabled: Boolean(applicationId),
  })
}

export function useDownloadCv() {
  return async (application: EmployerApplicant | string | number) => {
    if (typeof application === "object" && !canDownloadCv(application)) {
      throw new Error("CV download is not available for this application")
    }

    const applicationId = typeof application === "object" ? application.id : application
    const blob = await employerApplicantsService.downloadCv(applicationId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download =
      typeof application === "object"
        ? getApplicationCvDocument(application)?.name ?? `cv-${applicationId}.pdf`
        : `cv-${applicationId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export function usePreviewCv() {
  return async (application: EmployerApplicant | string | number) => {
    if (typeof application === "object" && !canPreviewCv(application)) {
      throw new Error("CV preview is not available for this application")
    }

    const applicationId = typeof application === "object" ? application.id : application
    const blob = await employerApplicantsService.previewCv(applicationId)
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
      // Only application data changes on a status change — refresh the detail
      // and applicant lists, leaving tests/interviews/notes/requests untouched.
      await client.invalidateQueries({ queryKey: ["employer", "applicants"] })
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
