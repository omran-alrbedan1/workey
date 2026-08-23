import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerInterview } from "../types/employerInterviews.types"

type InterviewCandidateLike = {
  full_name?: string | null
  name?: string | null
  email?: string | null
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

type InterviewProfileLike = {
  name?: string | null
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

type InterviewHistoryEntryLike = {
  changed_by?: {
    role?: unknown
    name?: string | null
  } | null
}

type InterviewDisplayLike = EmployerInterview & {
  candidate?: InterviewCandidateLike | null
  job_seeker_profile?: InterviewProfileLike | null
  job_application?: EmployerInterview["job_application"] & {
    candidate?: InterviewCandidateLike | null
    job_seeker_profile?: InterviewProfileLike | null
    status_history?: InterviewHistoryEntryLike[] | null
  }
}

export function interviewKey(value: unknown, fallback = "") {
  return keyOf(value, fallback)
}

export function interviewValue(value: unknown, fallback = "-") {
  return valueOf(value, fallback)
}

export function interviewCandidateName(interview: EmployerInterview, fallback: string) {
  const interviewData = interview as InterviewDisplayLike
  const application = interviewData.job_application
  const summary = application?.candidate_summary
  const identity = application?.submitted_snapshot?.profile?.identity
  const candidate = interviewData.candidate ?? application?.candidate
  const profile = application?.job_seeker_profile ?? interviewData.job_seeker_profile
  const candidateActor = application?.status_history?.find((entry) => {
    const role = entry?.changed_by?.role
    const roleKey = keyOf(role)
    return roleKey === "job_seeker" && entry.changed_by?.name
  })?.changed_by?.name

  return (
    summary?.name ||
    identity?.name ||
    identity?.full_name ||
    [identity?.first_name, identity?.last_name].filter(Boolean).join(" ") ||
    profile?.user?.name ||
    profile?.name ||
    candidate?.full_name ||
    candidate?.name ||
    candidate?.user?.name ||
    candidateActor ||
    identity?.email ||
    summary?.email ||
    profile?.user?.email ||
    candidate?.email ||
    candidate?.user?.email ||
    fallback
  )
}

export function interviewJobTitle(interview: EmployerInterview) {
  return interview.job_application?.job_posting?.title
}

export function actionAllowed(interview: EmployerInterview, action: string, fallback = false) {
  const actions = interview.allowed_actions
  if (Array.isArray(actions)) return actions.includes(action)
  if (actions && typeof actions === "object") {
    return Boolean(actions[action as keyof typeof actions])
  }

  const canManage = interview.permissions?.MANAGE_INTERVIEWS !== false
  const canEvaluate = interview.permissions?.EVALUATE_INTERVIEWS !== false
  const status = interviewKey(interview.status)
  const started = hasStarted(interview)
  const active = isActiveInterview(interview)
  const bothPresent = bothPartiesPresent(interview)

  switch (action) {
    case "update":
      return canManage && status === "scheduled"
    case "reschedule":
    case "cancel":
    case "no_show":
      return canManage && active && (action !== "no_show" || started)
    case "attendance":
      return canEvaluate && active && started
    case "complete":
      return canEvaluate && status === "confirmed" && started && bothPresent
    case "evaluate":
      return canEvaluate && status === "completed" && !interview.evaluation
    case "view_history":
      return canManage
    case "join_video":
      return (
        interviewKey(interview.mode ?? interview.interview_mode) === "online" &&
        active &&
        interview.embedded_video_available === true
      )
    default:
      return fallback
  }
}

export function scheduledStart(interview: EmployerInterview) {
  return interview.scheduled_start_at ?? interview.scheduled_at
}

export function scheduledEnd(interview: EmployerInterview) {
  return interview.scheduled_end_at ?? interview.ends_at
}

export function hasStarted(interview: EmployerInterview) {
  const start = scheduledStart(interview)
  if (!start) return false
  const date = new Date(start)
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now()
}

export function isActiveInterview(interview: EmployerInterview) {
  return ["scheduled", "confirmed", "rescheduled"].includes(interviewKey(interview.status))
}

export function bothPartiesPresent(interview: EmployerInterview) {
  return (
    interviewKey(interview.candidate_attendance_status) === "present" &&
    interviewKey(interview.interviewer_attendance_status) === "present"
  )
}
