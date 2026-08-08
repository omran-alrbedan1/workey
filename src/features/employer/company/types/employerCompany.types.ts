import type { KeyValueField } from "@/lib/keyValue"

export interface EmployerCompany {
  id?: string | number
  name: string
  industry?: string | null
  website?: string | null
  location?: string | null
  description?: string | null
  status?: KeyValueField
  approval_status?: KeyValueField | null
  logo_url?: string | null
  cover_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface EmployerCompanyInput {
  name: string
  industry?: string | null
  website?: string | null
  location?: string | null
  description?: string | null
  logo?: File | null
  remove_logo?: boolean
}
