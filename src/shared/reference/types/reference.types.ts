export interface City {
  id: string | number
  name: string
  country?: string | null
  region?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface CitiesResponse {
  data: City[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export interface JobFilter {
  id: string | number
  name: string
  slug: string
  type: "employment_type" | "experience_level" | "industry" | "skill"
  value?: string | null
}

export interface JobFiltersResponse {
  data: JobFilter[]
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

export interface ReferenceDataParams {
  search?: string
  country?: string
  type?: string
  page?: number
  per_page?: number
}
