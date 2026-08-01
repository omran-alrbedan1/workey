export interface TestQuestion {
  id?: string | number
  question_text: string
  question_type: TestQuestionType
  options?: Array<string | TestQuestionOption>
  correct_answer?: string | number
  correct_answers?: Array<string | number>
  points: number
  sort_order?: number
  order_index?: number
  is_required?: boolean
}

export type TestQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_text"
  | "long_text"
  | "file_upload"
  | "objective"
  | "essay"

export interface TestQuestionOption {
  id?: string | number
  option_text?: string
  text?: string
  is_correct?: boolean
  sort_order?: number
  order_index?: number
}

export interface EmployerTest {
  id: string | number
  title: string
  description?: string | null
  instructions?: string | null
  duration_minutes: number
  max_score: number
  passing_score: number
  passing_score_percentage?: number | null
  score_configuration_valid?: boolean
  is_active: boolean
  questions?: TestQuestion[]
  has_assignments?: boolean
  created_at?: string
}

export interface EmployerTestInput {
  title: string
  description?: string
  instructions?: string
  duration_minutes: number
  max_score?: number
  passing_score?: number
  is_active?: boolean
  questions?: TestQuestion[]
}

export interface AssignTestInput {
  test_id: string | number
  note?: string
  deadline_at?: string | null
  max_attempts?: number
  instructions?: string
}

export interface AssignTestPayload {
  test_id: string | number
  note?: string
  deadline_at?: string | null
  max_attempts?: number
  instructions?: string
}

export interface ReorderQuestionsInput {
  questions: Array<{
    question_id: string | number
    order_index: number
  }>
}

export interface ReorderOptionsInput {
  options: Array<{
    option_id: string | number
    order_index: number
  }>
}

export interface TestAttemptAnswer {
  id?: string | number
  question_id: string | number
  question?: TestQuestion
  answer_text?: string | null
  selected_option_ids?: Array<string | number>
  uploaded_file?: {
    id?: string | number
    file_name?: string
    mime_type?: string
    size?: number
  } | null
  awarded_points?: number | null
  reviewer_note?: string | null
  graded_at?: string | null
}

export interface ManualGradingInput {
  awarded_points: number
  reviewer_note?: string | null
}

export interface BulkManualGradingInput {
  gradings: Array<ManualGradingInput & { question_id: string | number }>
}

export interface TestAttemptResult {
  id?: string | number
  test_attempt_id?: string | number
  status?: string
  grading_status?: string
  total_points?: number | null
  awarded_points?: number | null
  objective_score?: string | number | null
  objective_max_score?: string | number | null
  manual_score?: string | number | null
  manual_max_score?: string | number | null
  total_score?: string | number | null
  max_score?: string | number | null
  percentage?: number | null
  is_passing_score_met?: boolean | null
  passed?: boolean | null
  objective_points?: number | null
  breakdown?: Array<{
    question_id?: string | number
    is_correct?: boolean
    awarded_points?: string | number | null
    max_points?: string | number | null
  }>
  manual_grading?: {
    total: number
    graded: number
    remaining: number
  }
  answers?: TestAttemptAnswer[]
}

export interface AssignmentDeadlineInput {
  deadline_at: string | null
  reason: string
}

export interface AssignmentDeadlineHistoryItem {
  id: string | number
  previous_deadline_at?: string | null
  deadline_at?: string | null
  reason?: string
  actor?: { id?: string | number; name?: string }
  created_at?: string
}

export interface RetakePolicyInput {
  max_attempts: number
  reason: string
}

export interface GrantRetakeInput {
  deadline_at?: string | null
  reason?: string
  instructions?: string
}

export interface AttemptSeriesItem {
  id?: string | number
  assignment_id?: string | number
  attempt_id?: string | number
  test_attempt_id?: string | number
  status?: string
  attempt_number?: number
  deadline_at?: string | null
  score?: string | number | null
  total_score?: string | number | null
  max_score?: string | number | null
  percentage?: string | number | null
  passed?: boolean | null
  started_at?: string | null
  submitted_at?: string | null
  created_at?: string | null
}
