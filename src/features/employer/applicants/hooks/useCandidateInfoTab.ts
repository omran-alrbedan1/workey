import { keyOf, valueOf } from "@/lib/keyValue"
import { candidateHeadline } from "../utils/candidateDisplay"
import type { ApplicationStatusKey, EmployerApplicantDetail } from "../types/employerApplicants.types"

export interface CandidateInfoModel {
  application: EmployerApplicantDetail
  candidateName: string
  avatarInitial: string
  headline: string
  statusLabel: string
  matchScore: number | null | undefined
  matchPercent: number | null
  matchTone: "success" | "warning" | "danger"
  nextStatuses: ApplicationStatusKey[]
  profile: EmployerApplicantDetail["submitted_snapshot"]["profile"] | undefined
  contact: {
    email?: string
    phone?: string
    location?: string
  }
  links: Array<{
    href: string
    label: string
  }>
  summary: {
    applicationId: string
    position: string
    appliedAt: string
    latestStatus: string
  }
  applicationSummary: {
    status: string
    lastUpdated: string
    snapshotStatus: string
    consentToShareProfile: boolean
  }
  latestActivity: {
    status: string
    changedBy: string
    changedAt: string
    note?: string | null
  }
  job: {
    title: string
    department: string
    employmentType: string
    experienceLevel: string
    educationLevel: string
    workMode: string
    location: string
    salary: string
  }
  skills: {
    required: NonNullable<EmployerApplicantDetail["job_posting"]["required_skills"]>
    niceToHave: NonNullable<EmployerApplicantDetail["job_posting"]["nice_to_have_skills"]>
  }
}

export function useCandidateInfoTab(
  application: EmployerApplicantDetail,
  candidateName: string,
): CandidateInfoModel {
  const profile = application.submitted_snapshot?.profile
  const job = application.job_posting
  const latestStatus = application.status_history?.[application.status_history.length - 1]
  const currentStatusKey = keyOf(application.status)
  const matchScore = application.match_score ?? application.matching_score
  const matchPercent = formatMatchPercent(matchScore)

  return {
    application,
    candidateName,
    avatarInitial: candidateName.charAt(0).toUpperCase(),
    headline: candidateHeadline(application) || profile?.identity?.email || "",
    statusLabel: valueOf(application.status, "applied"),
    matchScore,
    matchPercent,
    matchTone: getMatchTone(matchPercent),
    nextStatuses: (application.allowed_status_transitions?.map((status) => status.key) ?? []).filter(
      (status) => status !== currentStatusKey,
    ),
    profile,
    contact: {
      email: profile?.identity?.email,
      phone: profile?.identity?.phone,
      location: profile?.location?.city || profile?.location?.full_address || profile?.location?.location_text,
    },
    links: [
      { href: profile?.professional?.linkedin_url, label: "LinkedIn" },
      { href: profile?.professional?.github_url, label: "GitHub" },
      { href: profile?.professional?.portfolio_url, label: "Portfolio" },
    ].filter((link): link is { href: string; label: string } => Boolean(link.href)),
    summary: {
      applicationId: `#${application.id}`,
      position: job?.title ?? "-",
      appliedAt: formatDate(application.applied_at ?? application.created_at),
      latestStatus: valueOf(latestStatus?.to_status, valueOf(application.status, "-")),
    },
    applicationSummary: {
      status: valueOf(application.status, "-"),
      lastUpdated: formatDate(application.updated_at),
      snapshotStatus: valueOf(application.snapshot_status, "-"),
      consentToShareProfile: Boolean(application.consent_to_share_profile),
    },
    latestActivity: {
      status: valueOf(latestStatus?.to_status, valueOf(application.status, "-")),
      changedBy: latestStatus?.changed_by?.name ?? "-",
      changedAt: formatDate(latestStatus?.changed_at),
      note: latestStatus?.note,
    },
    job: {
      title: job?.title ?? "-",
      department: job?.department ?? "-",
      employmentType: valueOf(job?.employment_type, "-"),
      experienceLevel: valueOf(job?.experience_level, "-"),
      educationLevel: valueOf(job?.education_level, "-"),
      workMode: valueOf(job?.work_mode, "-"),
      location: job?.city || job?.location || "-",
      salary: formatSalary(job?.salary_min, job?.salary_max),
    },
    skills: {
      required: job?.required_skills ?? [],
      niceToHave: job?.nice_to_have_skills ?? [],
    },
  }
}

function formatMatchPercent(value?: number | null) {
  if (value == null) return null
  return value <= 1 ? Math.round(value * 100) : Math.round(value)
}

function getMatchTone(value: number | null): CandidateInfoModel["matchTone"] {
  if (value == null || value < 40) return "danger"
  if (value < 70) return "warning"
  return "success"
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

function formatSalary(min?: string | number | null, max?: string | number | null) {
  if (!min && !max) return "-"
  if (min && max) return `${min} - ${max}`
  return String(min ?? max)
}
