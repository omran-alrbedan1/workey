export interface EmployerCompany {
  id?: string | number
  name: string
  industry?: string | null
  website?: string | null
  location?: string | null
  description?: string | null
  status?: string
  approval_status?: string
}

export interface EmployerCompanyInput {
  name: string
  industry?: string
  website?: string
  location?: string
  description?: string
}
