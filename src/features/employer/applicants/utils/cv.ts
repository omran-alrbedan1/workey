import type { EmployerApplicant } from "../types/employerApplicants.types"
import { keyOf } from "@/lib/keyValue"

export interface ApplicationCvDocument {
  name: string
  canPreview: boolean
  canDownload: boolean
}

type CvDocumentSource =
  | {
      original_name?: string | null
      extension?: string | null
      preview_url?: string | null
      download_url?: string | null
      allowed_actions?: string[] | null
    }
  | null
  | undefined

function allowedActions(document: CvDocumentSource): Set<string> {
  return new Set(
    (document?.allowed_actions ?? []).map((action) => String(action).toLowerCase().trim()),
  )
}

/**
 * The CV is a supplementary document. It is only actionable when the API
 * explicitly allows it via `allowed_actions`; when no permissions are declared,
 * fall back to URL/snapshot availability.
 */
export function getApplicationCvDocument(
  application?: EmployerApplicant | null,
): ApplicationCvDocument | null {
  if (!application) return null

  const cv = application.submitted_snapshot?.cv
  const generated = application.submitted_snapshot?.generated_document
  const document: CvDocumentSource = cv ?? generated ?? null
  const snapshotAvailable = keyOf(application.snapshot_status) === "available"

  if (!document && !snapshotAvailable) return null

  const actions = allowedActions(document)
  const hasDeclaredPermissions = actions.size > 0
  const canPreview = hasDeclaredPermissions
    ? actions.has("preview")
    : Boolean(document?.preview_url) || snapshotAvailable
  const canDownload = hasDeclaredPermissions
    ? actions.has("download")
    : Boolean(document?.download_url) || snapshotAvailable

  if (!canPreview && !canDownload) return null

  const extension = cv?.extension || generated?.extension || "pdf"
  const name =
    cv?.original_name ||
    generated?.original_name ||
    application.submitted_cv_name ||
    `cv-${application.id}.${extension}`

  return { name, canPreview, canDownload }
}

export function canPreviewCv(application?: EmployerApplicant | null) {
  return getApplicationCvDocument(application)?.canPreview ?? false
}

export function canDownloadCv(application?: EmployerApplicant | null) {
  return getApplicationCvDocument(application)?.canDownload ?? false
}
