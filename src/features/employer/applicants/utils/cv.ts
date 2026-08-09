import type { EmployerApplicant } from "../types/employerApplicants.types"
import { keyOf } from "@/lib/keyValue"

export function hasSelectedCv(application?: EmployerApplicant | null) {
  return Boolean(
    application?.submitted_cv?.download_url ||
      application?.submitted_snapshot?.cv?.download_url ||
      application?.submitted_snapshot?.generated_document?.download_url ||
      keyOf(application?.snapshot_status) === "available",
  )
}

export function selectedCvDownloadName(application: EmployerApplicant) {
  const extension =
    application.submitted_snapshot?.cv?.extension ||
    application.selected_cv?.extension ||
    "pdf"

  return (
    application.submitted_snapshot?.cv?.original_name ||
    application.selected_cv?.original_name ||
    application.submitted_cv_name ||
    `cv-${application.id}.${extension}`
  )
}
