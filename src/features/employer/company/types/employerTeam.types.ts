import type { KeyValueField } from "@/lib/keyValue"

export type CompanyMemberRole =
  | "owner"
  | "company_admin"
  | "recruiter"
  | "interviewer"
  | "reviewer"

export interface CompanyMember {
  id: string | number
  user_id?: string | number
  name: string
  email: string
  role: KeyValueField
  company_role?: KeyValueField
  status: KeyValueField
  membership_status?: KeyValueField
  avatar_url?: string | null
  phone?: string | null
  last_active_at?: string | null
  joined_at?: string
  is_current_user?: boolean
  can_update_role?: boolean
  can_update_status?: boolean
  can_remove?: boolean
  available_actions?: {
    change_role?: boolean
    suspend?: boolean
    reactivate?: boolean
    remove?: boolean
  }
}

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired"

export interface CompanyInvitation {
  id: string | number
  email: string
  role: KeyValueField
  company_role?: KeyValueField
  status: KeyValueField
  invited_by?: { id: string | number; name: string } | null
  token?: string
  expires_at?: string | null
  created_at?: string
  accepted_at?: string | null
}

export interface TeamMemberInput {
  name?: string
  email?: string
}

export interface CompanyInvitationInput {
  email: string
  company_role: string
}

export interface MemberRoleInput {
  company_role: string
}

export interface MemberStatusInput {
  membership_status: "active" | "suspended"
}

export interface TransferOwnershipInput {
  new_owner_user_id: string | number
  current_owner_user_id?: string | number
  previous_owner_role?: "company_admin" | "recruiter" | "interviewer" | "reviewer"
}

export interface CompanyTeamSummary {
  members: CompanyMember[]
  invitations: CompanyInvitation[]
}

export interface CompanyInvitationResponse {
  invitation: CompanyInvitation
  token?: string
  message?: string
}
