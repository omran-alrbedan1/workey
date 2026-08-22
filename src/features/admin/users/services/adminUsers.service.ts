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
  AdminUserActivityEvent,
  AdminUserApplicationItem,
  AdminUserAuditLogItem,
  AdminUserInterviewItem,
  AdminUserJobItem,
  AdminUserLoginItem,
  AdminUserSessionItem,
  AdminUserTestAssignmentItem,
  UpdateUserRoleInput,
} from "../types/adminUsers.types"

function normalizeRecord<T extends { role?: unknown }>(record: T): T {
  return {
    ...record,
    role: keyOf(record.role),
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
  async get(id: string | number): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(await api.get(API_ENDPOINTS.admin.userById(id)))
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
  async activate(id: string | number): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.activateUser(id)),
    )
    return normalizeRecord(entity)
  },
  async suspend(id: string | number): Promise<AdminUserRecord> {
    const entity = unwrapEntity<AdminUserRecord>(
      await api.patch(API_ENDPOINTS.admin.suspendUser(id)),
    )
    return normalizeRecord(entity)
  },
  async listApplications(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserApplicationItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userApplications(id), { params }),
    )
  },
  async listJobs(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserJobItem>> {
    return unwrapCollection(await api.get(API_ENDPOINTS.admin.userJobs(id), { params }))
  },
  async listInterviews(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserInterviewItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userInterviews(id), { params }),
    )
  },
  async listTestAssignments(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserTestAssignmentItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userTestAssignments(id), { params }),
    )
  },
  async listActivity(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserActivityEvent>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userActivity(id), { params }),
    )
  },
  async listAuditLogs(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserAuditLogItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userAuditLogs(id), { params }),
    )
  },
  async listLoginHistory(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserLoginItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userLoginHistory(id), { params }),
    )
  },
  async listSessions(
    id: string | number,
    params: AdminListParams = {},
  ): Promise<AdminCollection<AdminUserSessionItem>> {
    return unwrapCollection(
      await api.get(API_ENDPOINTS.admin.userSessions(id), { params }),
    )
  },
}
