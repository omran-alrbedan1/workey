import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerEntity } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerProfile, EmployerProfileInput } from "../types/employerProfile.types"

export const employerProfileService = {
  async get(): Promise<EmployerProfile> {
    return unwrapEmployerEntity<EmployerProfile>(await api.get(API_ENDPOINTS.employer.profile))
  },

  async update(input: EmployerProfileInput): Promise<EmployerProfile> {
    return unwrapEmployerEntity<EmployerProfile>(
      await api.put(API_ENDPOINTS.employer.profile, input),
    )
  },
}
