import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerEntity } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerCompany, EmployerCompanyInput } from "../types/employerCompany.types"

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
        headers: { "Content-Type": "multipart/form-data" },
      }),
    )
  },

  async updateCoverImage(formData: FormData): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.post("/company/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    )
  },

  async removeCoverImage(): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(
      await api.delete("/company/cover-image"),
    )
  },
}
