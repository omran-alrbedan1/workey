import { api } from "@/lib/api"
import type { PublicCompany, PublicCompanyJobsResponse } from "../types/publicCompany.types"

export const publicCompanyService = {
  async getCompanyBySlug(slug: string): Promise<PublicCompany> {
    const response = await api.get<PublicCompany>(`/api/v1/companies/${slug}`)
    return response
  },

  async getCompanyJobs(slug: string, page = 1, perPage = 20): Promise<PublicCompanyJobsResponse> {
    const response = await api.get<PublicCompanyJobsResponse>(`/api/v1/companies/${slug}/jobs`, {
      params: { page, per_page: perPage },
    })
    return response
  },
}
