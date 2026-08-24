import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import { unwrapEntity } from "@/features/admin/shared/services/adminResponse.utils"
import type {
  AdminApplicationsReport,
  AdminCvParsingReport,
  AdminJobsReport,
  AdminOverviewReport,
  AdminReportFilters,
} from "../types/adminReports.types"

function cleanFilters<T extends AdminReportFilters>(filters: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  ) as Partial<T>
}

export const adminReportsService = {
  async overview(): Promise<AdminOverviewReport> {
    return unwrapEntity<AdminOverviewReport>(await api.get(API_ENDPOINTS.admin.reports.overview))
  },

  async applications(filters: AdminReportFilters = {}): Promise<AdminApplicationsReport> {
    const { date_from, date_to, company_id, job_id } = filters
    return unwrapEntity<AdminApplicationsReport>(
      await api.get(API_ENDPOINTS.admin.reports.applications, {
        params: cleanFilters({ date_from, date_to, company_id, job_id }),
      }),
    )
  },

  async jobs(filters: AdminReportFilters = {}): Promise<AdminJobsReport> {
    const { date_from, date_to, company_id, status } = filters
    return unwrapEntity<AdminJobsReport>(
      await api.get(API_ENDPOINTS.admin.reports.jobs, {
        params: cleanFilters({ date_from, date_to, company_id, status }),
      }),
    )
  },

  async cvParsing(
    filters: Pick<AdminReportFilters, "date_from" | "date_to"> = {},
  ): Promise<AdminCvParsingReport> {
    return unwrapEntity<AdminCvParsingReport>(
      await api.get(API_ENDPOINTS.admin.reports.cvParsing, { params: cleanFilters(filters) }),
    )
  },
}
