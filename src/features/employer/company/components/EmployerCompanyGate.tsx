import { AlertTriangle, Building2 } from "lucide-react"
import type React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { keyOf } from "@/lib/keyValue"
import { useEmployerCompany } from "../hooks/useEmployerCompany"

export default function EmployerCompanyGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common")
  const company = useEmployerCompany()

  if (company.isPending) return <div className="h-96 animate-pulse rounded-lg bg-background-secondary" />

  if (company.isError || !company.data) {
    return (
      <CompanyGateState
        title={t("companyGate.unavailableTitle")}
        description={t("companyGate.unavailableDescription")}
      />
    )
  }

  const status = keyOf(company.data.approval_status ?? company.data.status, "pending")
  if (status === "approved") return children

  const copyByStatus: Record<string, { title: string; description: string }> = {
    pending: {
      title: t("companyGate.pendingTitle"),
      description: t("companyGate.pendingDescription"),
    },
    rejected: {
      title: t("companyGate.rejectedTitle"),
      description: t("companyGate.rejectedDescription"),
    },
    suspended: {
      title: t("companyGate.suspendedTitle"),
      description: t("companyGate.suspendedDescription"),
    },
  }

  const state = copyByStatus[status] ?? copyByStatus.pending

  return <CompanyGateState title={state.title} description={state.description} />
}

function CompanyGateState({ title, description }: { title: string; description: string }) {
  const { t } = useTranslation("common")
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-xl border border-amber-300/50 bg-amber-50/60 p-8 text-center dark:border-amber-500/30 dark:bg-amber-950/20">
      <div className="max-w-lg">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
        <Button asChild className="mt-6">
          <Link to={ROUTES.employer.company}>
            <Building2 className="h-4 w-4" />
            {t("companyGate.viewCompany")}
          </Link>
        </Button>
      </div>
    </section>
  )
}
