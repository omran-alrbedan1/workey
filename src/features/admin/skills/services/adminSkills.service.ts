import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type { AdminSkillInput, AdminSkillRecord } from "../types/adminSkills.types"
export const adminSkillsService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminSkillRecord>> {
    return unwrapCollection<AdminSkillRecord>(await api.get(API_ENDPOINTS.admin.skills, { params }))
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
  async uploadIcon(id: string | number, file: File): Promise<AdminSkillRecord> {
    const formData = new FormData()
    formData.append("icon", file)
    return unwrapEntity<AdminSkillRecord>(
      await api.post(API_ENDPOINTS.admin.skillIcon(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    )
  },
  async deleteIcon(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.admin.skillIcon(id))
  },
}
