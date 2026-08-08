import type { KeyValueField } from "@/lib/keyValue"

export interface EmployerJob {
  id: string | number
  title: string
  description?: string | null
  department?: string | null
  responsibilities?: string | null
  benefits?: string | null
  requirements?: string | null
  employment_type?: KeyValueField | null
  experience_level?: KeyValueField | null
  education_level?: KeyValueField | null
  work_mode?: KeyValueField | null
  location?: string | null
  city?: {
    id: string | number
    name: string
  } | null
  application_deadline?: string | null
  accepting_applications?: boolean
  salary_min?: number | null
  salary_max?: number | null
  status?: KeyValueField | null
  applications_count?: number
  created_at?: string
  published_at?: string | null
  skills?: EmployerJobSkill[]
  has_application_deadline?: boolean
  is_application_deadline_passed?: boolean
  is_accepting_applications?: boolean
  can_apply?: boolean
}

export interface EmployerJobSkill {
  id: string | number
  name?: string
  slug?: string
  icon_url?: string
  requirement_type?: KeyValueField | null
  weight?: number | null
}

export type JobWorkMode = "remote" | "on_site" | "hybrid"
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship"
export type ExperienceLevel = "entry_level" | "junior" | "mid_level" | "senior"
export type EducationLevel = "high_school" | "diploma" | "bachelor" | "master" | "doctorate" | null
export type JobSkillRequirementType = "required" | "nice_to_have"
export type ScreeningQuestionType =
  | "short_text"
  | "long_text"
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
  department?: string | null
  responsibilities?: string | null
  benefits?: string | null
  requirements: string
  employment_type: EmploymentType
  experience_level: ExperienceLevel
  education_level?: string | null
  work_mode: JobWorkMode
  location?: string | null
  city_id?: string | number | null
  application_deadline?: string | null
  salary_min?: number | null
  salary_max?: number | null
}

export interface JobSkillAssignmentInput {
  skill_id: string | number
  weight: number
}

export interface EmployerJobSkillsInput {
  required_skills?: JobSkillAssignmentInput[]
  nice_to_have_skills?: JobSkillAssignmentInput[]
}

export interface JobScreeningQuestionOption {
  id?: string | number
  option_text: string
  sort_order?: number
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
  options?: JobScreeningQuestionOption[]
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
