export interface AdminSkillRecord {
  id: string | number
  name: string
  slug: string
  created_at?: string
}
export interface AdminSkillInput {
  name: string
  slug: string
}
