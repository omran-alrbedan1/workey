import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import type {
  CitiesResponse,
  JobFiltersResponse,
  ReferenceDataParams,
} from "../types/reference.types"

export const referenceService = {
  async getCities(params?: ReferenceDataParams): Promise<CitiesResponse> {
    const response = await api.get<CitiesResponse>(API_ENDPOINTS.reference.cities, {
      params: {
        search: params?.search,
        country: params?.country,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 100,
      },
    })
    return response
  },

  async getJobFilters(params?: ReferenceDataParams): Promise<JobFiltersResponse> {
    const response = await api.get<JobFiltersResponse>(API_ENDPOINTS.reference.jobFilters, {
      params: {
        type: params?.type,
        search: params?.search,
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 100,
      },
    })
    return response
  },
}
