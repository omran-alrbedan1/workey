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
  role: AdminKeyValueField
  status: AdminKeyValueField
  invited_by?: { id: string | number; name: string } | null
  expires_at?: string | null
  created_at?: string | null
}

export interface AdminCompanyMemberInput {
  name?: string
  email?: string
}

export interface AdminCompanyInvitationInput {
  email: string
  role: string
}

export interface AdminCompanyMemberRoleInput {
  role: string
}
