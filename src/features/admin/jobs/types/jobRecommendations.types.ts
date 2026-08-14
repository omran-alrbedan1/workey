export interface RecommendedJob {
  id: string | number
  title: string
  slug: string
  company: {
    id: string | number
    name: string
    slug: string
  }
  location?: string | null
  employment_type?: string | null
  experience_level?: string | null
  salary_min?: number | null
  salary_max?: number | null
  salary_currency?: string | null
  is_remote?: boolean
  match_score?: number
  match_reasons?: string[]
  created_at?: string
}

export interface RecommendedJobsResponse {
  data: RecommendedJob[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface CandidateRecommendationsParams {
  candidateId: string | number
  page?: number
  per_page?: number
}
