import type { KeyValueField } from "@/lib/keyValue"

export type CompanyMemberRole = "owner" | "admin" | "recruiter" | "interviewer" | "member"

export interface CompanyMember {
  id: string | number
  name: string
  email: string
  role: KeyValueField
  status: KeyValueField
  avatar_url?: string | null
  phone?: string | null
  last_active_at?: string | null
  joined_at?: string
  is_current_user?: boolean
  can_update_role?: boolean
  can_update_status?: boolean
  can_remove?: boolean
}

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired"

export interface CompanyInvitation {
  id: string | number
  email: string
  role: KeyValueField
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
  role: string
}

export interface MemberRoleInput {
  role: string
}

export interface MemberStatusInput {
  status: string
}

export interface TransferOwnershipInput {
  user_id: string | number
}

export interface CompanyTeamSummary {
  members: CompanyMember[]
  invitations: CompanyInvitation[]
}

export interface CompanyInvitationResponse {
  invitation: CompanyInvitation
  message?: string
}
