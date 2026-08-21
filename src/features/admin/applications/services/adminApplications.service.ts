import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapCollection, unwrapEntity } from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type {
  AdminApplicationDetailRecord,
  AdminApplicationRecord,
} from "../types/adminApplications.types"
import type { AdminJobRecord } from "@/features/admin/jobs/types/adminJobs.types"

interface ApiErrorLike {
  statusCode?: number
}

function isNotFound(error: unknown) {
  return typeof error === "object" && error !== null && (error as ApiErrorLike).statusCode === 404
}

function withJobContext(
  application: AdminApplicationRecord,
  job: AdminJobRecord,
): AdminApplicationRecord {
  return {
    ...application,
    job: application.job ?? {
      id: job.id,
      title: job.title,
      company: job.company,
    },
    company: application.company ?? application.job?.company ?? job.company,
  }
}

export const adminApplicationsService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminApplicationRecord>> {
    try {
      return unwrapCollection<AdminApplicationRecord>(
        await api.get(API_ENDPOINTS.admin.applications, { params }),
      )
    } catch (error) {
      if (!isNotFound(error)) throw error

      const jobs = unwrapCollection<AdminJobRecord>(
        await api.get(API_ENDPOINTS.admin.jobs, {
          params: {
            page: 1,
            per_page: 100,
            sort_by: "created_at",
            sort_direction: "desc",
          },
        }),
      )

      const applicationCollections = await Promise.all(
        jobs.items.map(async (job) => {
          try {
            return unwrapCollection<AdminApplicationRecord>(
              await api.get(API_ENDPOINTS.jobs.applications(job.id), {
                params: { page: 1, per_page: 100 },
              }),
            ).items.map((application) => withJobContext(application, job))
          } catch {
            return []
          }
        }),
      )

      const allApplications = applicationCollections.flat().sort((a, b) => {
        const aDate = a.applied_at ?? a.submitted_at ?? a.created_at ?? ""
        const bDate = b.applied_at ?? b.submitted_at ?? b.created_at ?? ""
        return bDate.localeCompare(aDate)
      })

      const perPage = params.per_page ?? 15
      const currentPage = params.page ?? 1
      const start = (currentPage - 1) * perPage
      const items = allApplications.slice(start, start + perPage)

      return {
        items,
        pagination: {
          currentPage,
          lastPage: Math.max(1, Math.ceil(allApplications.length / perPage)),
          perPage,
          total: allApplications.length,
        },
      }
    }
  },

  async show(id: string | number): Promise<AdminApplicationDetailRecord> {
    return unwrapEntity<AdminApplicationDetailRecord>(
      await api.get(API_ENDPOINTS.admin.applicationById(id)),
    )
  },
}
