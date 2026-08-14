import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import type { RecommendedJobsResponse, CandidateRecommendationsParams } from "../types/jobRecommendations.types"

export const jobRecommendationsService = {
  async getRecommendedJobs(params?: CandidateRecommendationsParams): Promise<RecommendedJobsResponse> {
    const response = await api.get<RecommendedJobsResponse>(API_ENDPOINTS.admin.recommendedJobs, {
      params: {
        candidate_id: params?.candidateId,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 20,
      },
    })
    return response
  },
}
