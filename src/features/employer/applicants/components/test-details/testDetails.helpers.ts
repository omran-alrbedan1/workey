import type { EmployerTestAttempt } from "../../types/employerApplicants.types"
import type { TestAttemptResultBreakdownItem } from "@/features/employer/tests/types/employerTests.types"

export type GradeDraft = {
  awarded_points: string
  reviewer_note: string
}

export const nextSteps = [
  { value: "interview_pending", labelKey: "statuses.interview_pending" },
  { value: "final_review", labelKey: "statuses.final_review" },
  { value: "on_hold", labelKey: "statuses.on_hold" },
  { value: "rejected", labelKey: "statuses.rejected" },
] as const

const manualQuestionTypes = new Set(["short_text", "long_text", "file_upload"])

export function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

export function attemptId(assignment?: EmployerTestAttempt | null) {
  return assignment?.attempt?.id ?? null
}

export function assignmentDeadline(assignment?: EmployerTestAttempt | null) {
  return assignment?.effective_deadline_at ?? assignment?.deadline_at ?? null
}

export function attemptScore(assignment?: EmployerTestAttempt | null) {
  return assignment?.attempt?.total_score ?? assignment?.attempt?.score ?? null
}

export function attemptMaxScore(assignment?: EmployerTestAttempt | null) {
  return assignment?.attempt?.max_score ?? Number(assignment?.test?.max_score ?? 0)
}

export function canManuallyGrade(answer: TestAttemptResultBreakdownItem) {
  return manualQuestionTypes.has(answer.question_type.key)
}

export function selectedAnswer(answer: TestAttemptResultBreakdownItem) {
  if (answer.answer_text) return answer.answer_text
  if (answer.selected_options.length > 0) {
    return answer.selected_options.map((option) => option.option_text).join(", ")
  }
  if (answer.file?.original_name) return answer.file.original_name
  return "-"
}
