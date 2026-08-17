import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export interface AdminCompanyMember {
  id: string | number
  name: string
  email: string
  role: AdminKeyValueField
  status: AdminKeyValueField
  avatar_url?: string | null
  phone?: string | null
  last_active_at?: string | null
  joined_at?: string | null
  is_owner?: boolean
}

export interface AdminCompanyInvitation {
  id: string | number
  email: string
  company_role: AdminKeyValueField
  status: AdminKeyValueField
  invited_by?: { id: string | number; name: string } | null
  invited_by_user_id?: string | number | null
  accepted_by_user_id?: string | number | null
  expires_at?: string | null
  accepted_at?: string | null
  rejected_at?: string | null
  revoked_at?: string | null
  created_at?: string | null
}

export interface AdminCompanyMemberInput {
  name?: string
  email?: string
}

export interface AdminCompanyInvitationInput {
  email: string
  company_role: string
}

export interface AdminCompanyInvitationResult {
  invitation: AdminCompanyInvitation
  token: string
}

export interface AdminCompanyMemberRoleInput {
  company_role: string
}

export interface AdminCompanyMemberStatusInput {
  membership_status: "active" | "suspended"
}

export interface AdminCompanyTransferOwnershipInput {
  new_owner_user_id: string | number
  current_owner_user_id?: string | number
  previous_owner_role?: "company_admin" | "recruiter" | "interviewer" | "reviewer"
}
