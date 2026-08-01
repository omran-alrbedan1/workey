import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type { AdminCompanyDetails, AdminCompanyRecord } from "../types/adminCompanies.types"

export const adminCompaniesService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminCompanyRecord>> {
    return unwrapCollection<AdminCompanyRecord>(
      await api.get(API_ENDPOINTS.admin.companies, { params }),
    )
  },
  async approve(id: string | number): Promise<AdminCompanyRecord> {
    return unwrapEntity<AdminCompanyRecord>(
      await api.patch(API_ENDPOINTS.admin.approveCompany(id)),
    )
  },
  async details(id: string | number): Promise<AdminCompanyDetails> {
    return unwrapEntity<AdminCompanyDetails>(await api.get(API_ENDPOINTS.admin.companyById(id)))
  },
  async reject({
    id,
    reason,
  }: {
    id: string | number
    reason: string
  }): Promise<AdminCompanyRecord> {
    return unwrapEntity<AdminCompanyRecord>(
      await api.patch(API_ENDPOINTS.admin.rejectCompany(id), { reason }),
    )
  },
  async suspend(id: string | number): Promise<AdminCompanyRecord> {
    return unwrapEntity<AdminCompanyRecord>(
      await api.patch(API_ENDPOINTS.admin.suspendCompany(id)),
    )
  },
}
