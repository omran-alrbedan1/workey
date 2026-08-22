import arCommon from "./locales/ar/common.json"
import arAuthPassword from "./locales/ar/authPassword.json"
import arAdminCompanies from "./locales/ar/admin/companies.json"
import arAdminNavigation from "./locales/ar/admin/navigation.json"
import arAdminUsers from "./locales/ar/admin/users.json"
import arAdminApplications from "./locales/ar/admin/applications.json"
import arAdminAuditLogs from "./locales/ar/admin/auditLogs.json"
import arAdminAuth from "./locales/ar/admin/auth.json"
import arAdminDashboard from "./locales/ar/admin/dashboard.json"
import arAdminJobs from "./locales/ar/admin/jobs.json"
import arAdminNotifications from "./locales/ar/admin/notifications.json"
import arAdminReports from "./locales/ar/admin/reports.json"
import arAdminSettings from "./locales/ar/admin/settings.json"
import arAdminShared from "./locales/ar/admin/shared.json"
import arAdminSkills from "./locales/ar/admin/skills.json"
import arAdminTests from "./locales/ar/admin/tests.json"
import arEmployerApplicants from "./locales/ar/employer/applicants.json"
import arEmployerAuth from "./locales/ar/employer/auth.json"
import arEmployerCompany from "./locales/ar/employer/company.json"
import arEmployerDashboard from "./locales/ar/employer/dashboard.json"
import arEmployerInterviews from "./locales/ar/employer/interviews.json"
import arEmployerJobs from "./locales/ar/employer/jobs.json"
import arEmployerNavigation from "./locales/ar/employer/navigation.json"
import arEmployerNotifications from "./locales/ar/employer/notifications.json"
import arEmployerProfile from "./locales/ar/employer/profile.json"
import arEmployerSettings from "./locales/ar/employer/settings.json"
import arEmployerShared from "./locales/ar/employer/shared.json"
import arEmployerTests from "./locales/ar/employer/tests.json"
import arTranslation from "./locales/ar/translation.json"
import enCommon from "./locales/en/common.json"
import enAuthPassword from "./locales/en/authPassword.json"
import enAdminCompanies from "./locales/en/admin/companies.json"
import enAdminNavigation from "./locales/en/admin/navigation.json"
import enAdminUsers from "./locales/en/admin/users.json"
import enAdminApplications from "./locales/en/admin/applications.json"
import enAdminAuditLogs from "./locales/en/admin/auditLogs.json"
import enAdminAuth from "./locales/en/admin/auth.json"
import enAdminDashboard from "./locales/en/admin/dashboard.json"
import enAdminJobs from "./locales/en/admin/jobs.json"
import enAdminNotifications from "./locales/en/admin/notifications.json"
import enAdminReports from "./locales/en/admin/reports.json"
import enAdminSettings from "./locales/en/admin/settings.json"
import enAdminShared from "./locales/en/admin/shared.json"
import enAdminSkills from "./locales/en/admin/skills.json"
import enAdminTests from "./locales/en/admin/tests.json"
import enEmployerApplicants from "./locales/en/employer/applicants.json"
import enEmployerAuth from "./locales/en/employer/auth.json"
import enEmployerCompany from "./locales/en/employer/company.json"
import enEmployerDashboard from "./locales/en/employer/dashboard.json"
import enEmployerInterviews from "./locales/en/employer/interviews.json"
import enEmployerJobs from "./locales/en/employer/jobs.json"
import enEmployerNavigation from "./locales/en/employer/navigation.json"
import enEmployerNotifications from "./locales/en/employer/notifications.json"
import enEmployerProfile from "./locales/en/employer/profile.json"
import enEmployerSettings from "./locales/en/employer/settings.json"
import enEmployerShared from "./locales/en/employer/shared.json"
import enEmployerTests from "./locales/en/employer/tests.json"
import enTranslation from "./locales/en/translation.json"

export const defaultNamespace = "translation"

export const resources = {
  en: {
    translation: enTranslation,
    common: enCommon,
    authPassword: enAuthPassword,
    adminCompanies: enAdminCompanies,
    adminNavigation: enAdminNavigation,
    adminUsers: enAdminUsers,
    adminApplications: enAdminApplications,
    adminAuditLogs: enAdminAuditLogs,
    adminAuth: enAdminAuth,
    adminDashboard: enAdminDashboard,
    adminJobs: enAdminJobs,
    adminNotifications: enAdminNotifications,
    adminReports: enAdminReports,
    adminSettings: enAdminSettings,
    adminShared: enAdminShared,
    adminSkills: enAdminSkills,
    adminTests: enAdminTests,
    employerApplicants: enEmployerApplicants,
    employerAuth: enEmployerAuth,
    employerCompany: enEmployerCompany,
    employerDashboard: enEmployerDashboard,
    employerInterviews: enEmployerInterviews,
    employerJobs: enEmployerJobs,
    employerNavigation: enEmployerNavigation,
    employerNotifications: enEmployerNotifications,
    employerProfile: enEmployerProfile,
    employerSettings: enEmployerSettings,
    employerShared: enEmployerShared,
    employerTests: enEmployerTests,
  },
  ar: {
    translation: arTranslation,
    common: arCommon,
    authPassword: arAuthPassword,
    adminCompanies: arAdminCompanies,
    adminNavigation: arAdminNavigation,
    adminUsers: arAdminUsers,
    adminApplications: arAdminApplications,
    adminAuditLogs: arAdminAuditLogs,
    adminAuth: arAdminAuth,
    adminDashboard: arAdminDashboard,
    adminJobs: arAdminJobs,
    adminNotifications: arAdminNotifications,
    adminReports: arAdminReports,
    adminSettings: arAdminSettings,
    adminShared: arAdminShared,
    adminSkills: arAdminSkills,
    adminTests: arAdminTests,
    employerApplicants: arEmployerApplicants,
    employerAuth: arEmployerAuth,
    employerCompany: arEmployerCompany,
    employerDashboard: arEmployerDashboard,
    employerInterviews: arEmployerInterviews,
    employerJobs: arEmployerJobs,
    employerNavigation: arEmployerNavigation,
    employerNotifications: arEmployerNotifications,
    employerProfile: arEmployerProfile,
    employerSettings: arEmployerSettings,
    employerShared: arEmployerShared,
    employerTests: arEmployerTests,
  },
} as const

export const namespaces = Object.keys(resources.en)
