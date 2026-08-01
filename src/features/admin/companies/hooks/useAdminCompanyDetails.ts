import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"

import { adminCompaniesService } from "../services/adminCompanies.service"
import type { AdminCompanyDetails, AdminCompanyRecord } from "../types/adminCompanies.types"

const companyKeys = {
  all: ["admin", "companies"] as const,
  details: (id: string | number) => ["admin", "companies", "details", String(id)] as const,
}

function mapRecordToDetails(company: AdminCompanyRecord): AdminCompanyDetails {
  return {
    ...company,
    legal_name: company.name,
    description: null,
    contact_email: company.employer?.email ?? null,
    employer: company.employer
      ? {
          name: company.employer.name ?? null,
          email: company.employer.email ?? null,
        }
      : null,
    verification_items: [],
    recent_jobs: [],
    recent_activity: [],
  }
}

export function useAdminCompanyDetails(id?: string) {
  const client = useQueryClient()

  const fallbackCompany = useMemo(() => {
    if (!id) return null
    const queries = client.getQueriesData<AdminCollection<AdminCompanyRecord>>({
      queryKey: companyKeys.all,
    })

    for (const [, data] of queries) {
      const found = data?.items?.find((company) => String(company.id) === String(id))
      if (found) return mapRecordToDetails(found)
    }

    return null
  }, [client, id])

  const query = useQuery({
    queryKey: companyKeys.details(id ?? "missing"),
    queryFn: () => adminCompaniesService.details(id as string),
    enabled: Boolean(id),
    retry: false,
  })

  return {
    ...query,
    company: query.data ?? fallbackCompany,
    hasFallbackData: Boolean(fallbackCompany),
    isBackendCoverageMissing: query.isError && Boolean(fallbackCompany),
  }
}
