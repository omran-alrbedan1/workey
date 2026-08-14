import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type { AdminCompanyDetails, AdminCompanyRecord } from "../types/adminCompanies.types"
import type {
  AdminCompanyInvitation,
  AdminCompanyInvitationInput,
  AdminCompanyMember,
  AdminCompanyMemberRoleInput,
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
  async createInvitation(
    companyId: string | number,
    input: AdminCompanyInvitationInput,
  ): Promise<AdminCompanyInvitation> {
    return unwrapEntity<AdminCompanyInvitation>(
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
}
