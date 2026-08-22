import { API_ENDPOINTS, APP_CONFIG } from "@/config"
import { api } from "@/lib/api"
import { normalizeKeyValue } from "@/features/admin/shared/services/adminResponse.utils"

import type {
  AdminCompany,
  AdminApplication,
  AdminJob,
  AdminSkill,
  AdminTest,
  AdminUser,
  CollectionMeta,
  CollectionResult,
} from "../types/adminDashboard.types"

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeCollection<T>(response: unknown): CollectionResult<T> {
  let payload: unknown = response

  if (isRecord(payload) && "data" in payload) payload = payload.data

  let items: T[] = []
  let paginationSource: UnknownRecord = {}

  if (Array.isArray(payload)) {
    items = payload as T[]
  } else if (isRecord(payload)) {
    if (Array.isArray(payload.data)) items = payload.data as T[]
    else if (Array.isArray(payload.items)) items = payload.items as T[]

    paginationSource = isRecord(payload.meta)
      ? payload.meta
      : isRecord(payload.pagination)
        ? payload.pagination
        : payload
  }

  const total = asNumber(paginationSource.total, items.length)
  const perPage = asNumber(
    paginationSource.per_page ?? paginationSource.perPage,
    Math.max(items.length, APP_CONFIG.pagination.defaultPageSize),
  )

  const meta: CollectionMeta = {
    currentPage: asNumber(paginationSource.current_page ?? paginationSource.currentPage, 1),
    lastPage: asNumber(
      paginationSource.last_page ?? paginationSource.lastPage,
      Math.max(1, Math.ceil(total / perPage)),
    ),
    perPage,
    total,
  }

  return { items, meta }
}

const dashboardPageSize = 100

function normalizeUser(user: AdminUser): AdminUser {
  return {
    ...user,
    role: normalizeKeyValue(user.role) as AdminUser["role"],
    status: normalizeKeyValue(user.status) as AdminUser["status"],
  }
}

function normalizeCompany(company: AdminCompany): AdminCompany {
  return {
    ...company,
  }
}

export const adminDashboardService = {
  async getUsers(): Promise<CollectionResult<AdminUser>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.users, {
      params: { per_page: dashboardPageSize },
      skipNotFoundRedirect: true,
    })
    const collection = normalizeCollection<AdminUser>(response)
    return { ...collection, items: collection.items.map(normalizeUser) }
  },

  async getCompanies(): Promise<CollectionResult<AdminCompany>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.companies, {
      params: { per_page: dashboardPageSize },
      skipNotFoundRedirect: true,
    })
    const collection = normalizeCollection<AdminCompany>(response)
    return { ...collection, items: collection.items.map(normalizeCompany) }
  },

  async getSkills(): Promise<CollectionResult<AdminSkill>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.skills)
    return normalizeCollection<AdminSkill>(response)
  },

  async getJobs(): Promise<CollectionResult<AdminJob>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.jobs, {
      params: { page: 1, per_page: dashboardPageSize },
      skipNotFoundRedirect: true,
    })
    return normalizeCollection<AdminJob>(response)
  },

  async getOpenJobs(): Promise<CollectionResult<AdminJob>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.jobs, {
      params: { page: 1, per_page: 1, accepting_applications: true },
      skipNotFoundRedirect: true,
    })
    return normalizeCollection<AdminJob>(response)
  },

  async getApplications(): Promise<CollectionResult<AdminApplication>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.applications, {
      params: { page: 1, per_page: dashboardPageSize },
      skipNotFoundRedirect: true,
    })
    return normalizeCollection<AdminApplication>(response)
  },

  async getTests(): Promise<CollectionResult<AdminTest>> {
    const response = await api.get<unknown>(API_ENDPOINTS.admin.tests, {
      skipNotFoundRedirect: true,
    })
    return normalizeCollection<AdminTest>(response)
  },
}
