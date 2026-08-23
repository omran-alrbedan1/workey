import type { EmployerTestAttempt } from "../types/employerApplicants.types"
import type {
  TestAttemptResult,
  TestAttemptResultBreakdownItem,
} from "@/features/employer/tests/types/employerTests.types"

const manualQuestionTypes = new Set(["short_text", "long_text", "file_upload"])

export function attemptId(attempt: EmployerTestAttempt) {
  return attempt.attempt?.id ?? null
}

export function assignmentId(attempt: EmployerTestAttempt) {
  return attempt.id
}

export function assignmentDeadline(attempt: EmployerTestAttempt): string | null {
  return attempt.effective_deadline_at ?? attempt.deadline_at ?? null
}

export function formatDeadline(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString()
}

export function attemptScore(attempt: EmployerTestAttempt | null): number | null {
  if (!attempt) return null
  return attempt.attempt?.total_score ?? attempt.attempt?.score ?? null
}

export function attemptMaxScore(attempt: EmployerTestAttempt | null): number {
  if (!attempt) return 0
  return attempt.attempt?.max_score ?? Number(attempt.test?.max_score ?? 0)
}

export function getQuestionId(answer: TestAttemptResultBreakdownItem) {
  return answer.question_id
}

export function getQuestionPoints(answer: TestAttemptResultBreakdownItem) {
  return Number(answer.max_points ?? 0)
}

export function getSelectedAnswer(answer: TestAttemptResultBreakdownItem) {
  if (answer.answer_text) return answer.answer_text

  if (answer.selected_options.length > 0) {
    return answer.selected_options.map((option) => option.option_text).join(", ")
  }
  if (answer.file?.original_name) return answer.file.original_name
  return "-"
}

export function getResultScore(result: TestAttemptResult | null) {
  if (!result) return null
  return result.total_score ?? null
}

export function getResultMax(result: TestAttemptResult | null, fallback: number) {
  if (!result) return fallback
  return result.max_score ?? fallback
}

export function canManuallyGrade(answer: TestAttemptResultBreakdownItem) {
  return manualQuestionTypes.has(answer.question_type.key)
}
