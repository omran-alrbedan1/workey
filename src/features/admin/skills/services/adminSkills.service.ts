import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type { AdminSkillInput, AdminSkillRecord } from "../types/adminSkills.types"
export const adminSkillsService = {
  async list(): Promise<AdminCollection<AdminSkillRecord>> {
    return unwrapCollection<AdminSkillRecord>(await api.get(API_ENDPOINTS.admin.skills))
  },
  async create(input: AdminSkillInput): Promise<AdminSkillRecord> {
    return unwrapEntity<AdminSkillRecord>(await api.post(API_ENDPOINTS.admin.skills, input))
  },
  async update({
    id,
    ...input
  }: AdminSkillInput & { id: string | number }): Promise<AdminSkillRecord> {
    return unwrapEntity<AdminSkillRecord>(
      await api.patch(API_ENDPOINTS.admin.skillById(id), input),
    )
  },
  async remove(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.admin.skillById(id))
  },
}
