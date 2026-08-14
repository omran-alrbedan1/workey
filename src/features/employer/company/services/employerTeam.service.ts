import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type {
  CompanyInvitation,
  CompanyInvitationInput,
  CompanyMember,
  MemberRoleInput,
  MemberStatusInput,
  TransferOwnershipInput,
} from "../types/employerTeam.types"

export const employerTeamService = {
  async listMembers(): Promise<CompanyMember[]> {
    return unwrapEmployerCollection<CompanyMember>(
      await api.get(API_ENDPOINTS.companyTeam.members),
    ).items
  },

  async updateMemberRole(userId: string | number, input: MemberRoleInput): Promise<CompanyMember> {
    return unwrapEmployerCollection<CompanyMember>(
      await api.patch(API_ENDPOINTS.companyTeam.memberRole(userId), input),
    ).items[0] as CompanyMember
  },

  async updateMemberStatus(
    userId: string | number,
    input: MemberStatusInput,
  ): Promise<CompanyMember> {
    return unwrapEmployerCollection<CompanyMember>(
      await api.patch(API_ENDPOINTS.companyTeam.memberStatus(userId), input),
    ).items[0] as CompanyMember
  },

  async removeMember(userId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.companyTeam.member(userId))
  },

  async listInvitations(): Promise<CompanyInvitation[]> {
    return unwrapEmployerCollection<CompanyInvitation>(
      await api.get(API_ENDPOINTS.companyTeam.invitations),
    ).items
  },

  async createInvitation(input: CompanyInvitationInput): Promise<CompanyInvitation> {
    return unwrapEmployerCollection<CompanyInvitation>(
      await api.post(API_ENDPOINTS.companyTeam.invitations, input),
    ).items[0] as CompanyInvitation
  },

  async resendInvitation(invitationId: string | number): Promise<CompanyInvitation> {
    return unwrapEmployerCollection<CompanyInvitation>(
      await api.post(API_ENDPOINTS.companyTeam.invitationResend(invitationId)),
    ).items[0] as CompanyInvitation
  },

  async revokeInvitation(invitationId: string | number): Promise<void> {
    await api.post(API_ENDPOINTS.companyTeam.invitationRevoke(invitationId))
  },

  async transferOwnership(input: TransferOwnershipInput): Promise<void> {
    await api.post(API_ENDPOINTS.companyTeam.transferOwnership, input)
  },
}
