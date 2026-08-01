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

export const adminReportsService = {
  async overview(): Promise<AdminOverviewReport> {
    return unwrapEntity<AdminOverviewReport>(await api.get(API_ENDPOINTS.admin.reports.overview))
  },

  async applications(filters: AdminReportFilters = {}): Promise<AdminApplicationsReport> {
    return unwrapEntity<AdminApplicationsReport>(
      await api.get(API_ENDPOINTS.admin.reports.applications, { params: filters }),
    )
  },

  async jobs(filters: AdminReportFilters = {}): Promise<AdminJobsReport> {
    return unwrapEntity<AdminJobsReport>(
      await api.get(API_ENDPOINTS.admin.reports.jobs, { params: filters }),
    )
  },

  async cvParsing(filters: Pick<AdminReportFilters, "date_from" | "date_to"> = {}): Promise<AdminCvParsingReport> {
    return unwrapEntity<AdminCvParsingReport>(
      await api.get(API_ENDPOINTS.admin.reports.cvParsing, { params: filters }),
    )
  },
}
