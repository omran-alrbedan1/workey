import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerInterview } from "../types/employerInterviews.types"

export function interviewKey(value: unknown, fallback = "") {
  return keyOf(value, fallback)
}

export function interviewValue(value: unknown, fallback = "-") {
  return valueOf(value, fallback)
}

export function interviewCandidateName(interview: EmployerInterview, fallback: string) {
  const summary = interview.job_application?.candidate_summary
  const identity = interview.job_application?.submitted_snapshot?.profile?.identity
  return summary?.name || identity?.full_name || identity?.email || summary?.email || fallback
}

export function interviewJobTitle(interview: EmployerInterview) {
  return interview.job_application?.job_posting?.title
}

export function actionAllowed(interview: EmployerInterview, action: string, fallback: boolean) {
  const actions = interview.allowed_actions
  if (Array.isArray(actions)) return actions.includes(action)
  if (actions && typeof actions === "object") {
    return Boolean(actions[action as keyof typeof actions])
  }
  return fallback
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
