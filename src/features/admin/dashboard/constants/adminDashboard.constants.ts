export const adminDashboardQueryKeys = {
  root: ["admin", "dashboard"] as const,
  users: () => [...adminDashboardQueryKeys.root, "users"] as const,
  companies: () => [...adminDashboardQueryKeys.root, "companies"] as const,
  skills: () => [...adminDashboardQueryKeys.root, "skills"] as const,
  tests: () => [...adminDashboardQueryKeys.root, "tests"] as const,
}

export const ADMIN_DASHBOARD_STALE_TIME = 60_000
