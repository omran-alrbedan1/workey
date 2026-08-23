import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapEmployerCollection,
  unwrapEmployerEntity,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  CompanyInvitation,
  CompanyInvitationInput,
  CompanyInvitationResponse,
  CompanyMember,
  MemberRoleInput,
  MemberStatusInput,
  TransferOwnershipInput,
} from "../types/employerTeam.types"

function normalizeMember(member: CompanyMember): CompanyMember {
  const raw = member as CompanyMember & {
    user_id?: string | number
    company_role?: CompanyMember["role"]
    membership_status?: CompanyMember["status"]
    can_transfer_ownership?: boolean
    available_actions?: CompanyMember["available_actions"]
  }
  const role = raw.company_role ?? raw.role
  const status = raw.membership_status ?? raw.status

  return {
    ...member,
    id: raw.id ?? raw.user_id ?? "",
    role,
    status,
    can_update_role: member.can_update_role ?? member.available_actions?.change_role,
    can_update_status:
      member.can_update_status ??
      Boolean(member.available_actions?.suspend || member.available_actions?.reactivate),
    can_remove: member.can_remove ?? member.available_actions?.remove,
    can_transfer_ownership:
      raw.can_transfer_ownership ?? raw.available_actions?.transfer_ownership ?? false,
  }
}

function normalizeInvitation(invitation: CompanyInvitation): CompanyInvitation {
  const raw = invitation as CompanyInvitation & {
    company_role?: CompanyInvitation["role"]
  }
  const role = raw.company_role ?? raw.role

  return {
    ...invitation,
    role,
  }
}

function unwrapInvitationResult(response: unknown): CompanyInvitationResponse {
  const payload = unwrapEmployerEntity<unknown>(response)
  if (isRecord(payload) && isRecord(payload.invitation)) {
    return {
      ...payload,
      invitation: normalizeInvitation(payload.invitation as unknown as CompanyInvitation),
      token: typeof payload.token === "string" ? payload.token : undefined,
    } as CompanyInvitationResponse
  }

  return {
    invitation: normalizeInvitation(payload as CompanyInvitation),
  }
}

export const employerTeamService = {
  async listMembers(): Promise<CompanyMember[]> {
    return unwrapEmployerCollection<CompanyMember>(
      await api.get(API_ENDPOINTS.companyTeam.members),
    ).items.map(normalizeMember)
  },

  async updateMemberRole(userId: string | number, input: MemberRoleInput): Promise<CompanyMember> {
    return normalizeMember(
      unwrapEmployerEntity<CompanyMember>(
        await api.patch(API_ENDPOINTS.companyTeam.memberRole(userId), input),
      ),
    )
  },

  async updateMemberStatus(
    userId: string | number,
    input: MemberStatusInput,
  ): Promise<CompanyMember> {
    return normalizeMember(
      unwrapEmployerEntity<CompanyMember>(
        await api.patch(API_ENDPOINTS.companyTeam.memberStatus(userId), input),
      ),
    )
  },

  async removeMember(userId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.companyTeam.member(userId))
  },

  async listInvitations(): Promise<CompanyInvitation[]> {
    return unwrapEmployerCollection<CompanyInvitation>(
      await api.get(API_ENDPOINTS.companyTeam.invitations),
    ).items.map(normalizeInvitation)
  },

  async createInvitation(input: CompanyInvitationInput): Promise<CompanyInvitationResponse> {
    return unwrapInvitationResult(await api.post(API_ENDPOINTS.companyTeam.invitations, input))
  },

  async resendInvitation(invitationId: string | number): Promise<CompanyInvitationResponse> {
    return unwrapInvitationResult(
      await api.post(API_ENDPOINTS.companyTeam.invitationResend(invitationId)),
    )
  },

  async revokeInvitation(invitationId: string | number): Promise<void> {
    await api.post(API_ENDPOINTS.companyTeam.invitationRevoke(invitationId))
  },

  async transferOwnership(input: TransferOwnershipInput): Promise<void> {
    await api.post(API_ENDPOINTS.companyTeam.transferOwnership, input)
  },
}
