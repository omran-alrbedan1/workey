import type { AdminApplicationRecord } from "../types/adminApplications.types"

type CandidateLike = NonNullable<ReturnType<typeof candidateFor>>

export function candidateFor(item: AdminApplicationRecord) {
  return (
    item.candidate ??
    item.job_seeker ??
    item.jobSeeker ??
    item.applicant ??
    item.seeker ??
    item.candidate_user ??
    item.job_seeker_user ??
    item.candidate_profile ??
    item.job_seeker_profile ??
    item.profile ??
    item.user ??
    item.application?.candidate ??
    item.application?.job_seeker ??
    item.application?.jobSeeker ??
    item.application?.applicant ??
    item.application?.seeker ??
    item.application?.candidate_user ??
    item.application?.job_seeker_user ??
    item.application?.candidate_profile ??
    item.application?.job_seeker_profile ??
    item.application?.profile ??
    item.application?.user
  )
}

function fullNameFromParts(person?: CandidateLike) {
  return [person?.first_name, person?.last_name].filter(Boolean).join(" ").trim()
}

function personName(person?: CandidateLike): string | undefined {
  if (!person) return undefined
  return (
    person.full_name ||
    person.name ||
    fullNameFromParts(person) ||
    person.user?.full_name ||
    person.user?.name ||
    fullNameFromParts(person.user) ||
    person.profile?.full_name ||
    person.profile?.name ||
    [person.profile?.first_name, person.profile?.last_name].filter(Boolean).join(" ").trim() ||
    undefined
  )
}

function personEmail(person?: CandidateLike): string | undefined {
  if (!person) return undefined
  return person.email || person.user?.email || person.profile?.email || undefined
}

export function candidateNameFor(item: AdminApplicationRecord) {
  const candidate = candidateFor(item)
  return (
    personName(candidate) ||
    item.candidate_name ||
    item.job_seeker_name ||
    item.applicant_name ||
    item.application?.candidate_name ||
    item.application?.job_seeker_name ||
    item.application?.applicant_name
  )
}

export function candidateEmailFor(item: AdminApplicationRecord) {
  const candidate = candidateFor(item)
  return (
    personEmail(candidate) ||
    item.candidate_email ||
    item.job_seeker_email ||
    item.applicant_email ||
    item.application?.candidate_email ||
    item.application?.job_seeker_email ||
    item.application?.applicant_email
  )
}

export function jobFor(item: AdminApplicationRecord) {
  return item.job ?? item.application?.job
}

export function companyFor(item: AdminApplicationRecord) {
  return (
    item.company ?? item.job?.company ?? item.application?.company ?? item.application?.job?.company
  )
}

export function appliedAtFor(item: AdminApplicationRecord) {
  return item.applied_at ?? item.submitted_at ?? item.created_at
}
