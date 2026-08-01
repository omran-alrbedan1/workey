export interface EmployerProfile {
  id?: string | number
  job_title?: string | null
  phone?: string | null
  bio?: string | null
  user?: { name?: string; email?: string }
}

export interface EmployerProfileInput {
  job_title?: string
  phone?: string
  bio?: string
}
