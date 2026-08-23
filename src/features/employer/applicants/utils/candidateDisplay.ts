import type { EmployerApplicant } from "../types/employerApplicants.types"

type CandidateLike = {
  full_name?: string | null
  name?: string | null
  email?: string | null
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

type EmployerApplicantWithCandidate = EmployerApplicant & {
  candidate?: CandidateLike | null
}

function compact(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ")
}

function candidateFromStatusHistory(application: EmployerApplicant | null | undefined) {
  const history = application?.status_history ?? []
  return history.find((entry) => {
    const role = entry.changed_by?.role
    const roleKey =
      typeof role === "string"
        ? role
        : typeof role === "object" && role !== null
          ? role.key
          : undefined
    return roleKey === "job_seeker" && entry.changed_by?.name
  })?.changed_by?.name
}

export function candidateDisplayName(
  application: EmployerApplicant | null | undefined,
  fallback: string,
) {
  const applicant = application as EmployerApplicantWithCandidate | null | undefined
  const identity = application?.submitted_snapshot?.profile?.identity
  const profile = application?.job_seeker_profile
  const candidate = applicant?.candidate
  const historyName = candidateFromStatusHistory(application)

  return (
    application?.candidate_summary?.name ||
    identity?.name ||
    identity?.full_name ||
    compact([identity?.first_name, identity?.last_name]) ||
    profile?.user?.name ||
    profile?.name ||
    candidate?.full_name ||
    candidate?.name ||
    candidate?.user?.name ||
    historyName ||
    identity?.email ||
    application?.candidate_summary?.email ||
    profile?.user?.email ||
    candidate?.email ||
    candidate?.user?.email ||
    fallback
  )
}

export function hasCandidateDisplayData(application: EmployerApplicant | null | undefined) {
  return candidateDisplayName(application, "") !== ""
}

export function candidateSecondaryText(
  application: EmployerApplicant | null | undefined,
  fallback = "-",
) {
  const applicant = application as EmployerApplicantWithCandidate | null | undefined
  const identity = application?.submitted_snapshot?.profile?.identity
  const professional = application?.submitted_snapshot?.profile?.professional
  const profile = application?.job_seeker_profile
  const candidate = applicant?.candidate

  return (
    application?.candidate_summary?.email ||
    identity?.email ||
    profile?.user?.email ||
    candidate?.email ||
    candidate?.user?.email ||
    application?.candidate_summary?.headline ||
    identity?.headline ||
    professional?.headline ||
    profile?.headline ||
    identity?.summary ||
    professional?.summary ||
    profile?.summary ||
    fallback
  )
}

export function candidateHeadline(application: EmployerApplicant | null | undefined) {
  const identity = application?.submitted_snapshot?.profile?.identity
  const professional = application?.submitted_snapshot?.profile?.professional
  const profile = application?.job_seeker_profile

  return (
    application?.candidate_summary?.headline ||
    identity?.headline ||
    professional?.headline ||
    profile?.headline ||
    undefined
  )
}
