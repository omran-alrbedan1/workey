import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import type {
  Activity,
  ActivityListParams,
  ActivityListResponse,
} from "@/types/activity.types"

export const activityService = {
  async getActivity(params?: ActivityListParams): Promise<ActivityListResponse> {
    const response = await api.get<ActivityListResponse>(API_ENDPOINTS.activity, {
      params: {
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 20,
        ...(params?.filters ?? {}),
      },
    })
    return response
  },

  async getActivityById(id: string | number): Promise<Activity> {
    const response = await api.get<Activity>(`${API_ENDPOINTS.activity}/${id}`)
    return response
  },
}
