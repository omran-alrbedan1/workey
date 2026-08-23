import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import type {
  ApplicationStatusChangeInput,
  EmployerApplicant,
} from "../types/employerApplicants.types"
import { employerApplicantsService } from "../services/employerApplicants.service"
import { canPreviewCv, getApplicationCvDocument } from "../utils/cv"

function openDocumentUrl(url: string, target: "download" | "preview") {
  if (target === "preview") {
    window.open(url, "_blank", "noopener,noreferrer")
    return
  }

  const link = document.createElement("a")
  link.href = url
  link.rel = "noopener noreferrer"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function useEmployerApplicantDetail(applicationId?: string | number) {
  return useQuery({
    queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")],
    queryFn: () => employerApplicantsService.getById(applicationId!),
    enabled: Boolean(applicationId),
  })
}

export function useDownloadCv() {
  return async (application: EmployerApplicant) => {
    const document = getApplicationCvDocument(application)
    const url = application.submitted_snapshot?.cv?.download_url
      ?? application.submitted_snapshot?.generated_document?.download_url
      ?? application.submitted_cv?.download_url

    if (!document?.canDownload || !url) {
      throw new Error("CV download is not available for this application")
    }

    openDocumentUrl(url, "download")
  }
}

export function usePreviewCv() {
  return async (application: EmployerApplicant) => {
    const previewUrl = application.submitted_snapshot?.cv?.preview_url
      ?? application.submitted_snapshot?.generated_document?.preview_url
      ?? application.submitted_cv?.preview_url
      ?? application.submitted_snapshot?.cv?.download_url
      ?? application.submitted_snapshot?.generated_document?.download_url
      ?? application.submitted_cv?.download_url

    if (!canPreviewCv(application) || !previewUrl) {
      throw new Error("CV preview is not available for this application")
    }

    openDocumentUrl(previewUrl, "preview")
  }
}

export function useApplicationStatusMutation(applicationId?: string | number) {
  const { t } = useTranslation("employerApplicants")
  const client = useQueryClient()

  return useMutation({
    mutationFn: (input: ApplicationStatusChangeInput) =>
      employerApplicantsService.updateStatus(applicationId!, input),
    onSuccess: async () => {
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
      void client.invalidateQueries({
        queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")],
      })
    },
  })
}
