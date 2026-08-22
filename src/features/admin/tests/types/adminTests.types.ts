export interface AdminTestRecord {
  id: string | number
  company_id?: string | number
  title: string
  description?: string
  instructions?: string
  duration_minutes: number
  max_score: number
  passing_score: number
  is_active: boolean
  created_at?: string
}
export interface AdminTestInput {
  company_id: string | number
  title: string
  description?: string
  instructions?: string
  duration_minutes: number
  passing_score: number
  is_active?: boolean
}

export type AdminTestUpdateInput = Partial<AdminTestInput> & { id: string | number }
