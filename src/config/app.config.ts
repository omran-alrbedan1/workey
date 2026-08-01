export type AppTheme = "light" | "dark" | "system"
export type AppLocale = "en" | "ar"

export const APP_CONFIG = Object.freeze({
  name: "Workey",
  description: "Smart Recruitment Platform",
  version: "1.0.0",
  supportEmail: "support@workey.com",
  locale: "en" as AppLocale,
  theme: "system" as AppTheme,
  pagination: {
    defaultPage: 1,
    defaultPageSize: 15,
    pageSizeOptions: [10, 15, 25, 50, 100] as const,
  },
  roles: {
    admin: "admin",
    employer: "employer",
    jobSeeker: "job_seeker",
  },
} as const)

export type AppRole = (typeof APP_CONFIG.roles)[keyof typeof APP_CONFIG.roles]
