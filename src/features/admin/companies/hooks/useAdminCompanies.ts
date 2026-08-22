import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { APP_CONFIG } from "@/config"
import { adminCompaniesService } from "../services/adminCompanies.service"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { useFilters } from "@/hooks/useFilter"
import { useSearchParams } from "react-router-dom"
import { adminCompanyFilterConfig } from "../configs/adminCompanies.config"
import type { AdminCompanyFilterForm } from "../types/adminCompanies.types"

const keys = {
  all: ["admin", "companies"] as const,
  list: (page: number) => ["admin", "companies", page] as const,
}

export function useAdminCompanies() {
  const { t } = useTranslation("adminCompanies")
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const approvalStatus = searchParams.get("status")
  const client = useQueryClient()
  const query = useQuery({
    queryKey: [...keys.list(page), approvalStatus],
    queryFn: () =>
      adminCompaniesService.list({
        page,
        per_page: APP_CONFIG.pagination.defaultPageSize,
        approval_status: approvalStatus && approvalStatus !== "all" ? approvalStatus : undefined,
      }),
    placeholderData: keepPreviousData,
  })
  const refreshCompanies = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: keys.all, refetchType: "active" }),
      client.invalidateQueries({
        queryKey: ["admin", "dashboard", "companies"],
        refetchType: "active",
      }),
    ])
  const approveMutation = useMutation({
    mutationFn: adminCompaniesService.approve,
    onSuccess: async () => {
      await refreshCompanies()
      showSuccessToast(t("toasts.approved"))
    },
  })
  const rejectMutation = useMutation({
    mutationFn: adminCompaniesService.reject,
    onSuccess: async () => {
      await refreshCompanies()
      showSuccessToast(t("toasts.rejected"))
    },
  })
  const suspendMutation = useMutation({
    mutationFn: adminCompaniesService.suspend,
    onSuccess: async () => {
      await refreshCompanies()
      showSuccessToast(t("toasts.suspended"))
    },
  })
  const createMutation = useMutation({
    mutationFn: adminCompaniesService.create,
    onSuccess: async () => {
      await refreshCompanies()
      showSuccessToast("Company created")
    },
    onError: (error) => showErrorToast(error, "Unable to create company."),
  })
  const filtering = useFilters({
    data: query.data?.items ?? [],
    config: adminCompanyFilterConfig,
    syncWithURL: true,
  })
  const industries = Array.from(
    new Set(
      (query.data?.items ?? [])
        .map((company) => company.industry)
        .filter((industry): industry is string => Boolean(industry)),
    ),
  )
    .sort()
    .map((industry) => ({ value: industry, label: industry }))

  const applyFilters = (values: AdminCompanyFilterForm) => {
    setPage(1)
    filtering.applyFilters(values)
  }

  const resetFilters = () => {
    setPage(1)
    filtering.resetFilters()
  }

  return {
    ...query,
    companies: filtering.filteredData,
    filtersForForm: filtering.filtersForForm as Partial<AdminCompanyFilterForm>,
    industries,
    applyFilters,
    resetFilters,
    page,
    setPage,
    approveMutation,
    rejectMutation,
    suspendMutation,
    createMutation,
  }
}
