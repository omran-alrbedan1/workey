import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminCompanyDetails,
  AdminCompanyInput,
  AdminCompanyRecord,
} from "../types/adminCompanies.types"
import type {
  AdminCompanyInvitation,
  AdminCompanyInvitationInput,
  AdminCompanyInvitationResult,
  AdminCompanyMember,
  AdminCompanyMemberRoleInput,
  AdminCompanyMemberStatusInput,
  AdminCompanyTransferOwnershipInput,
} from "../types/adminCompanyMembers.types"

function normalizeCompany<T extends AdminCompanyRecord>(company: T): T {
  return {
    ...company,
  }
}

export const adminCompaniesService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminCompanyRecord>> {
    const collection = unwrapCollection<AdminCompanyRecord>(
      await api.get(API_ENDPOINTS.admin.companies, { params }),
    )
    return { ...collection, items: collection.items.map(normalizeCompany) }
  },
  async create(input: AdminCompanyInput): Promise<AdminCompanyDetails> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyDetails>(await api.post(API_ENDPOINTS.admin.companies, input)),
    )
  },
  async update(id: string | number, input: AdminCompanyInput): Promise<AdminCompanyDetails> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyDetails>(
        await api.patch(API_ENDPOINTS.admin.companyById(id), input),
      ),
    )
  },
  async approve(id: string | number): Promise<AdminCompanyRecord> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyRecord>(await api.patch(API_ENDPOINTS.admin.approveCompany(id))),
    )
  },
  async details(id: string | number): Promise<AdminCompanyDetails> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyDetails>(await api.get(API_ENDPOINTS.admin.companyById(id))),
    )
  },
  async reject({
    id,
    reason,
  }: {
    id: string | number
    reason: string
  }): Promise<AdminCompanyRecord> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyRecord>(
        await api.patch(API_ENDPOINTS.admin.rejectCompany(id), { reason }),
      ),
    )
  },
  async suspend(id: string | number): Promise<AdminCompanyRecord> {
    return normalizeCompany(
      unwrapEntity<AdminCompanyRecord>(await api.patch(API_ENDPOINTS.admin.suspendCompany(id))),
    )
  },
  async listMembers(companyId: string | number): Promise<AdminCollection<AdminCompanyMember>> {
    return unwrapCollection<AdminCompanyMember>(
      await api.get(API_ENDPOINTS.adminCompanyMembers.list(companyId)),
    )
  },
  async listInvitations(
    companyId: string | number,
  ): Promise<AdminCollection<AdminCompanyInvitation>> {
    return unwrapCollection<AdminCompanyInvitation>(
      await api.get(API_ENDPOINTS.adminCompanyMembers.invitation(companyId)),
    )
  },
  async createInvitation(
    companyId: string | number,
    input: AdminCompanyInvitationInput,
  ): Promise<AdminCompanyInvitationResult> {
    return unwrapEntity<AdminCompanyInvitationResult>(
      await api.post(API_ENDPOINTS.adminCompanyMembers.invitation(companyId), input),
    )
  },
  async updateMemberRole(
    companyId: string | number,
    userId: string | number,
    input: AdminCompanyMemberRoleInput,
  ): Promise<AdminCompanyMember> {
    return unwrapEntity<AdminCompanyMember>(
      await api.patch(API_ENDPOINTS.adminCompanyMembers.memberRole(companyId, userId), input),
    )
  },
  async updateMemberStatus(
    companyId: string | number,
    userId: string | number,
    input: AdminCompanyMemberStatusInput,
  ): Promise<AdminCompanyMember> {
    return unwrapEntity<AdminCompanyMember>(
      await api.patch(API_ENDPOINTS.adminCompanyMembers.memberStatus(companyId, userId), input),
    )
  },
  async removeMember(companyId: string | number, userId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.adminCompanyMembers.member(companyId, userId))
  },
  async transferOwnership(
    companyId: string | number,
    input: AdminCompanyTransferOwnershipInput,
  ): Promise<void> {
    await api.post(API_ENDPOINTS.adminCompanyMembers.transferOwnership(companyId), input)
  },
}
