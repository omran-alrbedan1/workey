export interface PublicCompany {
  id: string | number
  name: string
  slug: string
  description?: string | null
  industry?: string | null
  location?: string | null
  website?: string | null
  logo?: string | null
  cover_image?: string | null
  size?: string | null
  founded_year?: number | null
  total_jobs?: number
  is_verified?: boolean
  social_links?: {
    linkedin?: string | null
    twitter?: string | null
    facebook?: string | null
  }
}

export interface PublicCompanyJob {
  id: string | number
  title: string
  slug: string
  description?: string | null
  location?: string | null
  employment_type?: string | null
  experience_level?: string | null
  salary_min?: number | null
  salary_max?: number | null
  salary_currency?: string | null
  is_remote?: boolean
  is_active?: boolean
  created_at?: string
  applications_count?: number
}

export interface PublicCompanyJobsResponse {
  data: PublicCompanyJob[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
