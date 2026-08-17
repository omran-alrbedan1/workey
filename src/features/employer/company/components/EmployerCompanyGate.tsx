import { AlertTriangle, Building2 } from "lucide-react"
import type React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"
import { keyOf } from "@/lib/keyValue"
import { useEmployerCompany } from "../hooks/useEmployerCompany"

export default function EmployerCompanyGate({ children }: { children: React.ReactNode }) {
  const company = useEmployerCompany()

  if (company.isPending) return <div className="h-96 animate-pulse rounded-lg bg-background-secondary" />

  if (company.isError || !company.data) {
    return (
      <CompanyGateState
        title="Company access unavailable"
        description="We could not verify your company access. Refresh the page or contact an administrator if this continues."
      />
    )
  }

  const status = keyOf(company.data.approval_status ?? company.data.status, "pending")
  if (status === "approved") return children

  const copyByStatus: Record<string, { title: string; description: string }> = {
    pending: {
      title: "Company approval is pending",
      description:
        "Your company must be approved before you can manage jobs, applicants, interviews, tests, or ranked candidates.",
    },
    rejected: {
      title: "Company was rejected",
      description:
        "This company cannot use recruiting tools until an administrator reviews or updates its approval status.",
    },
    suspended: {
      title: "Company is suspended",
      description:
        "Recruiting tools are paused for this company. Contact an administrator before continuing.",
    },
  }

  const state = copyByStatus[status] ?? copyByStatus.pending

  return <CompanyGateState title={state.title} description={state.description} />
}

function CompanyGateState({ title, description }: { title: string; description: string }) {
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
            View company
          </Link>
        </Button>
      </div>
    </section>
  )
}
