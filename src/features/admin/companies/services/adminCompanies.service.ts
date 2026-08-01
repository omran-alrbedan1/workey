import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  normalizeKeyValue,
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type { AdminCompanyDetails, AdminCompanyRecord } from "../types/adminCompanies.types"

function normalizeCompany<T extends AdminCompanyRecord>(company: T): T {
  return {
    ...company,
    status: normalizeKeyValue(company.status),
    approval_status: normalizeKeyValue(company.approval_status),
    employer: company.employer
      ? {
          ...company.employer,
          status: normalizeKeyValue(company.employer.status),
        }
      : company.employer,
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
}
