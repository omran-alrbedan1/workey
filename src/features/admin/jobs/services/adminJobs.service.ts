import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type { AdminJobRecord } from "../types/adminJobs.types"

export const adminJobsService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminJobRecord>> {
    return unwrapCollection<AdminJobRecord>(
      await api.get(API_ENDPOINTS.admin.jobs, { params }),
    )
  },
  async get(id: string | number): Promise<AdminJobRecord> {
    return unwrapEntity<AdminJobRecord>(await api.get(API_ENDPOINTS.admin.jobById(id)))
  },
}
