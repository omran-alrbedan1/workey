import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerEntity } from "@/features/employer/shared/services/employerResponse.utils"
import type {
  InformationRequest,
  InformationRequestInput,
  InformationRequestUpdateInput,
} from "../types/employerInformationRequests.types"

export const employerInformationRequestsService = {
  async create(
    jobApplicationId: string | number,
    input: InformationRequestInput,
  ): Promise<InformationRequest> {
    const response = await api.post(
      API_ENDPOINTS.applications.informationRequests(jobApplicationId),
      input,
    )
    return unwrapEmployerEntity<InformationRequest>(response)
  },

  async list(jobApplicationId: string | number): Promise<InformationRequest[]> {
    const response = await api.get(
      API_ENDPOINTS.applications.informationRequests(jobApplicationId),
    )
    return unwrapEmployerEntity<InformationRequest[]>(response)
  },

  async getById(informationRequestId: string | number): Promise<InformationRequest> {
    const response = await api.get(
      API_ENDPOINTS.informationRequests.byId(informationRequestId),
    )
    return unwrapEmployerEntity<InformationRequest>(response)
  },

  async update(
    informationRequestId: string | number,
    input: InformationRequestUpdateInput,
  ): Promise<InformationRequest> {
    const response = await api.patch(
      API_ENDPOINTS.informationRequests.byId(informationRequestId),
      input,
    )
    return unwrapEmployerEntity<InformationRequest>(response)
  },

  async cancel(informationRequestId: string | number): Promise<void> {
    await api.post(API_ENDPOINTS.informationRequests.cancel(informationRequestId))
  },
}
