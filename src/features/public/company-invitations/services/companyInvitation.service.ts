import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import type {
  AcceptCompanyInvitationInput,
  CompanyInvitationDetails,
} from "../types/companyInvitation.types"

function unwrapEntity<T>(response: unknown): T {
  if (typeof response === "object" && response !== null && "data" in response) {
    const data = (response as { data: unknown }).data
    if (typeof data === "object" && data !== null && "data" in data) {
      return (data as { data: T }).data
    }
    return data as T
  }

  return response as T
}

export const companyInvitationService = {
  async inspect(token: string): Promise<CompanyInvitationDetails> {
    return unwrapEntity<CompanyInvitationDetails>(
      await api.get(API_ENDPOINTS.companyInvitations.byToken(token)),
    )
  },

  async accept(token: string, input: AcceptCompanyInvitationInput): Promise<void> {
    await api.post(API_ENDPOINTS.companyInvitations.accept(token), input)
  },

  async reject(token: string): Promise<void> {
    await api.post(API_ENDPOINTS.companyInvitations.reject(token))
  },
}
