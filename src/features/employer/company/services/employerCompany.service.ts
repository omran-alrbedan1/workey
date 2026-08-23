import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEmployerEntity } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerCompany, EmployerCompanyInput } from "../types/employerCompany.types"

const UPLOAD_TIMEOUT = 120_000

export const employerCompanyService = {
  async get(): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(await api.get(API_ENDPOINTS.company.self))
  },

  async update(input: EmployerCompanyInput): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(await api.put(API_ENDPOINTS.company.self, input))
  },

  async updateLogo(file: File): Promise<EmployerCompany> {
    const formData = new FormData()
    formData.append("logo", file)
    formData.append("_method", "PUT")
    return unwrapEmployerEntity<EmployerCompany>(
      await api.post(API_ENDPOINTS.company.self, formData, {
        timeout: UPLOAD_TIMEOUT,
        headers: {
          "Content-Type": undefined,
        },
      }),
    )
  },

  async updateCoverImage(file: File): Promise<EmployerCompany> {
    const formData = new FormData()
    formData.append("image", file)
    return unwrapEmployerEntity<EmployerCompany>(
      await api.post(API_ENDPOINTS.company.coverImage, formData, {
        timeout: UPLOAD_TIMEOUT,
        headers: {
          "Content-Type": undefined,
        },
      }),
    )
  },

  async removeCoverImage(): Promise<EmployerCompany> {
    return unwrapEmployerEntity<EmployerCompany>(await api.delete(API_ENDPOINTS.company.coverImage))
  },
}
