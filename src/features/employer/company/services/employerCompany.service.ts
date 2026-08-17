import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerEntity } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerCompany, EmployerCompanyInput } from "../types/employerCompany.types"

const UPLOAD_TIMEOUT = 120_000

export const employerCompanyService = {
  async get(): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(await api.get(API_ENDPOINTS.employer.company))
  },

  async update(input: EmployerCompanyInput): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.put(API_ENDPOINTS.employer.company, input),
    )
  },

  async updateLogo(formData: FormData): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.put(API_ENDPOINTS.employer.company, formData, {
        timeout: UPLOAD_TIMEOUT,
      }),
    )
  },

  async updateCoverImage(formData: FormData): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.post("/company/cover-image", formData, {
        timeout: UPLOAD_TIMEOUT,
      }),
    )
  },

  async removeCoverImage(): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.delete("/company/cover-image"),
    )
  },
}
