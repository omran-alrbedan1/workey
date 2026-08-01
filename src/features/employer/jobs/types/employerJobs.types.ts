export interface EmployerJob {
  id: string | number
  title: string
  description?: string | null
  department?: string | null
  responsibilities?: string | null
  benefits?: string | null
  requirements?: string | null
  employment_type?: string | null
  experience_level?: string | null
  work_mode?: JobWorkMode | null
  location?: string | null
  application_deadline?: string | null
  accepting_applications?: boolean
  salary_min?: number | null
  salary_max?: number | null
  status?: string
  applications_count?: number
  created_at?: string
  published_at?: string | null
  skills?: EmployerJobSkill[]
}

export interface EmployerJobSkill {
  id: string | number
  name?: string
  requirement_type?: JobSkillRequirementType
  pivot?: {
    requirement_type?: JobSkillRequirementType
    weight?: number | null
  }
  weight?: number | null
}

export type JobWorkMode = "remote" | "on_site" | "hybrid"
export type JobSkillRequirementType = "required" | "nice_to_have"
export type ScreeningQuestionType =
  | "short_text"
  | "number"
  | "boolean"
  | "single_choice"
  | "multiple_choice"

export interface EmployerJobFilterForm {
  work_mode: string
  employment_type: string
  accepting_applications: string
  sort_by: string
  sort_direction: string
}

export const EMPLOYER_JOB_FILTER_DEFAULTS: EmployerJobFilterForm = {
  work_mode: "all",
  employment_type: "all",
  accepting_applications: "all",
  sort_by: "created_at",
  sort_direction: "desc",
}

export interface EmployerJobInput {
  title: string
  description: string
  department?: string
  responsibilities?: string
  benefits?: string
  requirements: string
  employment_type: string
  experience_level: string
  work_mode: JobWorkMode
  location?: string
  application_deadline?: string | null
  salary_min?: number
  salary_max?: number
}

export interface JobSkillAssignmentInput {
  skill_id: string | number
  weight?: number
}

export interface EmployerJobSkillsInput {
  skill_ids?: Array<string | number>
  required_skills?: JobSkillAssignmentInput[]
  nice_to_have_skills?: JobSkillAssignmentInput[]
}

export interface JobScreeningQuestionOption {
  id?: string | number
  text: string
  sort_order?: number
  is_correct?: boolean
}

export interface JobScreeningQuestion {
  id: string | number
  job_id?: string | number
  question_text: string
  question_type: ScreeningQuestionType
  is_required: boolean
  sort_order?: number
  is_active?: boolean
  options?: JobScreeningQuestionOption[]
  created_at?: string
  updated_at?: string
}

export interface JobScreeningQuestionInput {
  question_text: string
  question_type: ScreeningQuestionType
  is_required?: boolean
  sort_order?: number
  options?: Array<string | JobScreeningQuestionOption>
}

export interface RankedCandidateScoreBreakdown {
  skills?: number
  experience?: number
  education?: number
  recency?: number
  profile_completeness?: number
  [key: string]: number | undefined
}

export interface RankedCandidate {
  application_id?: string | number
  candidate_id?: string | number
  score: number
  matching_score?: number
  matching_score_version?: string
  breakdown?: RankedCandidateScoreBreakdown
  matched_skills?: EmployerJobSkill[]
  missing_skills?: EmployerJobSkill[]
  reasons?: string[]
}
