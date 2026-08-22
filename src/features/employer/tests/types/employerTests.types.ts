// LocalizedValue type for backend responses with key/value structure
export interface LocalizedValue<T extends string = string> {
  key: T
  value: string
}

// Question Types - Backend enum values only
export type TestQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_text"
  | "long_text"
  | "file_upload"

// Assignment States - Backend enum values
export type TestAssignmentState = "not_started" | "in_progress" | "submitted" | "evaluated"

// Grading Status - Backend enum values
export type TestGradingStatus =
  | "pending"
  | "auto_graded"
  | "manual_grading_required"
  | "fully_graded"

// Grading Type - Backend enum values
export type TestGradingType = "automatic" | "manual"

// ============ RESPONSE TYPES (from Backend Resources) ============

export interface TestQuestionOptionResponse {
  id: string | number
  test_question_id: string | number
  option_text: string
  order_index: number
  is_correct?: boolean
  created_at?: string
  updated_at?: string
}

export interface TestQuestionResponse {
  id: string | number
  test_id: string | number
  question_text: string
  question_type: LocalizedValue<TestQuestionType>
  order_index: number
  points: number
  is_required: boolean
  image_url: string | null
  options: TestQuestionOptionResponse[]
  created_at?: string
  updated_at?: string
}

export interface TestResponse {
  id: string | number
  company_id: string | number
  title: string
  description: string | null
  instructions: string | null
  duration_minutes: number
  max_score: number
  passing_score: number
  passing_score_percentage: number | null
  score_configuration_valid: boolean
  question_count: number
  is_active: boolean
  has_assignments: boolean
  allowed_actions?: {
    update: boolean
    delete: boolean
    manage_questions: boolean
    assign: boolean
  } | null
  questions?: TestQuestionResponse[]
  created_at: string
  updated_at: string
}

export interface ApplicationTestAssignmentResponse {
  id: string | number
  job_application_id: string | number
  test_id: string | number

  attempt_number: number
  max_attempts: number
  attempts_remaining: number

  series_root_assignment_id: string | number | null
  previous_assignment_id: string | number | null

  is_latest_assignment: boolean
  is_superseded: boolean

  note: string | null
  assigned_at: string | null

  deadline_at: string | null
  effective_deadline_at: string | null

  is_time_expired: boolean
  has_deadline: boolean
  is_expired: boolean
  remaining_seconds: number | null

  extension_count: number | null
  latest_extension_at: string | null

  state: LocalizedValue<TestAssignmentState>
  status?: LocalizedValue<string> | string | null
  feedback?: string | null

  test: TestResponse | null
  attempt: TestAttemptResponse | null
}

export interface TestAttemptResponse {
  id: string | number
  application_test_assignment_id: string | number
  attempt_number: number

  started_at: string | null
  submitted_at: string | null

  deadline_at: string | null
  effective_deadline_at: string | null
  remaining_seconds: number | null
  is_time_expired: boolean
  is_expired: boolean
  can_start?: boolean
  can_edit_answers?: boolean
  can_submit?: boolean

  grading_status: LocalizedValue<TestGradingStatus>

  objective_score: number | null
  objective_max_score: number | null
  manual_score: number | null
  manual_max_score: number | null
  total_score: number | null
  max_score: number | null
  percentage: number | null
  is_passing_score_met: boolean | null

  auto_graded_at: string | null
  manually_graded_at: string | null
  evaluated_at?: string | null
  score?: number | null
  feedback?: string | null

  manual_grading_progress: {
    total: number
    graded: number
    remaining: number
    complete: boolean
  } | null

  breakdown: TestAttemptResultBreakdownItem[] | null
}

export interface TestAttemptResultBreakdownItem {
  question_id: string | number
  question_text: string
  question_type: LocalizedValue<TestQuestionType>
  answered: boolean
  max_points: number
  awarded_points: number | null
  grading_type: LocalizedValue<TestGradingType>
  requires_manual_grading: boolean
  answer_text: string | null
  file: {
    original_name: string | null
    mime_type: string | null
    size: number | null
    download_available: boolean
  } | null
  reviewer_note: string | null
  graded_at: string | null
  graded_by: {
    id: string | number
    name: string
  } | null
  selected_options: Array<{
    id: string | number
    option_text: string
  }>
  correct_options: Array<{
    id: string | number
    option_text: string
  }>
  is_correct: boolean | null
}

export interface TestAnswerResponse {
  id: string | number
  question_id: string | number
  question_type?: LocalizedValue<TestQuestionType>
  answer_text: string | null
  selected_options: Array<{
    id: string | number
    option_text: string
  }>
  file: {
    original_name: string | null
    mime_type: string | null
    size: number | null
    download_available: boolean
  } | null
  updated_at: string
}

export interface TestAssignmentDeadlineChangeResponse {
  id: string | number
  previous_deadline_at: string | null
  new_deadline_at: string | null
  reason: string | null
  changed_by: {
    id: string | number
    name: string
  }
  changed_at: string
}

export interface TestAssignmentSeriesResponse {
  test_id: string | number
  series_root_assignment_id: string | number
  max_attempts: number
  attempts_used: number
  attempts_remaining: number
  latest_assignment_id: string | number | null
  assignments: TestAssignmentSeriesItem[]
}

export interface TestAssignmentSeriesItem {
  assignment_id: string | number
  attempt_number: number
  deadline_at: string | null
  submitted_at: string | null
  grading_status: LocalizedValue<TestGradingStatus>
  percentage: number | null
  is_latest: boolean
  is_superseded: boolean

  previous_assignment_id: string | number | null
  retake_reason: string | null
  retake_granted_by: {
    id: string | number
    name: string
  } | null
}

// ============ INPUT TYPES (for API requests) ============

export interface TestQuestionInput {
  question_text: string
  question_type: TestQuestionType
  order_index: number
  points: number
  is_required: boolean
  options?: Array<{
    option_text: string
    order_index: number
    is_correct: boolean
  }>
}

export interface TestQuestionOptionInput {
  option_text: string
  order_index: number
  is_correct: boolean
}

export interface TestInput {
  title: string
  description?: string
  instructions?: string
  duration_minutes: number
  passing_score?: number
  is_active?: boolean
}

export interface AssignTestInput {
  test_id: string | number
  note?: string
  deadline_at?: string | null
  max_attempts: number
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

export interface ManualGradingInput {
  awarded_points: number
  reviewer_note?: string | null
}

export interface BulkManualGradingInput {
  gradings: Array<ManualGradingInput & { question_id: string | number }>
}

export interface AssignmentDeadlineInput {
  deadline_at: string | null
  reason: string
}

export interface RetakePolicyInput {
  max_attempts: number
  reason: string
}

export interface GrantRetakeInput {
  reason?: string
  instructions?: string
  deadline_at?: string | null
}

// ============ FORM VALUES TYPES (for React Hook Form) ============

export interface TestQuestionFormValues {
  question_text: string
  question_type: TestQuestionType
  points: number
  is_required: boolean
  options: Array<{
    id?: string | number
    option_text: string
    is_correct: boolean
  }>
}

export interface TestFormValues {
  title: string
  description?: string
  instructions?: string
  duration_minutes: number
  passing_score?: number
  is_active: boolean
  questions: TestQuestionFormValues[]
}

// ============ LEGACY TYPES (for backward compatibility - will be removed) ============

// @deprecated - Use TestResponse instead
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
  has_assignments?: boolean
  created_at?: string
  questions?: TestQuestionResponse[]
}

export type TestQuestion = Omit<TestQuestionInput, "order_index" | "options"> & {
  id?: string | number
  test_id?: string | number
  order_index?: number
  image_url?: string | null
  options?: Array<{
    id?: string | number
    option_text: string
    order_index?: number
    is_correct: boolean
  }>
}

export interface TestQuestionOption {
  id?: string | number
  test_question_id?: string | number
  option_text: string
  is_correct: boolean
  order_index?: number
}

// @deprecated - Use TestInput instead
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

// @deprecated - Use AssignTestInput instead
export interface AssignTestPayload {
  test_id: string | number
  note?: string
  deadline_at?: string | null
  max_attempts?: number
  instructions?: string
}

// @deprecated - Use TestAnswerResponse instead
export interface TestAttemptAnswer {
  id?: string | number
  question_id: string | number
  question_type?: LocalizedValue<TestQuestionType>
  answer_text: string | null
  selected_options?: Array<{ id: string | number; option_text: string }>
  file?: {
    original_name: string | null
    mime_type: string | null
    size: number | null
    download_available: boolean
  } | null
  updated_at?: string | null
}

// @deprecated - Use TestAttemptResponse instead
export interface TestAttemptResult {
  attempt_id: string | number
  status?: LocalizedValue<string> | string | null
  awarded_points?: number | null
  total_points?: number | null
  attempt_number?: number | null
  deadline_at?: string | null
  effective_deadline_at?: string | null
  remaining_seconds?: number | null
  is_time_expired?: boolean
  is_expired?: boolean
  grading_status?: LocalizedValue<TestGradingStatus>
  objective_score?: number | null
  objective_max_score?: number | null
  manual_score?: number | null
  manual_max_score?: number | null
  total_score?: number | null
  max_score?: number | null
  percentage?: number | null
  is_passing_score_met?: boolean | null
  submitted_at?: string | null
  auto_graded_at?: string | null
  manually_graded_at?: string | null
  manual_grading_progress?: TestAttemptResponse["manual_grading_progress"]
  breakdown?: TestAttemptResultBreakdownItem[]
}

// @deprecated - Use TestAssignmentDeadlineChangeResponse instead
export interface AssignmentDeadlineHistoryItem {
  id: string | number
  previous_deadline_at: string | null
  new_deadline_at: string | null
  reason: string | null
  changed_by: { id: string | number; name: string } | null
  changed_at: string | null
}

export type AttemptSeriesItem = TestAssignmentSeriesItem
