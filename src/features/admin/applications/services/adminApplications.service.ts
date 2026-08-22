import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminApplicationDetailRecord,
  AdminApplicationRecord,
} from "../types/adminApplications.types"

export const adminApplicationsService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminApplicationRecord>> {
    return unwrapCollection<AdminApplicationRecord>(
      await api.get(API_ENDPOINTS.admin.applications, { params, skipNotFoundRedirect: true }),
    )
  },

  async show(id: string | number): Promise<AdminApplicationDetailRecord> {
    return unwrapEntity<AdminApplicationDetailRecord>(
      await api.get(API_ENDPOINTS.admin.applicationById(id)),
    )
  },
}
