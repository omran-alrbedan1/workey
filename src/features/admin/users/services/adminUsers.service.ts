import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { keyOf } from "@/lib/keyValue"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminUserRecord,
  AdminUserDetails,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
} from "../types/adminUsers.types"

function normalizeRole(role: unknown): string {
  return keyOf(role)
}

function normalizeRecord<T extends { role?: unknown; status?: unknown }>(record: T): T {
  return {
    ...record,
    role: normalizeRole(record.role),
  }
}

export const adminUsersService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminUserRecord>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.users, {
      params,
    })
    const collection = unwrapCollection<AdminUserRecord>(response)
    return {
      ...collection,
      items: collection.items.map(normalizeRecord),
    }
  },
  async get(id: string | number): Promise<AdminUserDetails> {
    const entity = unwrapEntity<AdminUserDetails>(await api.get(API_ENDPOINTS.admin.userById(id)))
    return normalizeRecord(entity)
  },
  async updateRole(input: UpdateUserRoleInput): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.userRole(input.id), {
        role: input.role,
      }),
    )
    return normalizeRecord(entity)
  },
  async updateStatus(input: UpdateUserStatusInput): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.userStatus(input.id), {
        status: input.status,
        reason: input.reason,
      }),
    )
    return normalizeRecord(entity)
  },
  async activate(id: string | number): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.activateUser(id)),
    )
    return normalizeRecord(entity)
  },
  async suspend(id: string | number, reason?: string): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.suspendUser(id), { reason }),
    )
    return normalizeRecord(entity)
  },
}
