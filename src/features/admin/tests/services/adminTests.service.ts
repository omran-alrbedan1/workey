import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminTestInput,
  AdminTestRecord,
  AdminTestUpdateInput,
} from "../types/adminTests.types"
export const adminTestsService = {
  async list(): Promise<AdminCollection<AdminTestRecord>> {
    return unwrapCollection<AdminTestRecord>(await api.get(API_ENDPOINTS.admin.tests))
  },
  async create(input: AdminTestInput): Promise<AdminTestRecord> {
    return unwrapEntity<AdminTestRecord>(await api.post(API_ENDPOINTS.admin.tests, input))
  },
  async update({ id, ...input }: AdminTestUpdateInput): Promise<AdminTestRecord> {
    return unwrapEntity<AdminTestRecord>(await api.put(API_ENDPOINTS.admin.testById(id), input))
  },
  async remove(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.admin.testById(id))
  },
}
