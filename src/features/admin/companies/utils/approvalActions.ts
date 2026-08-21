import { keyOf } from "@/lib/keyValue"

import type { AdminCompanyRecord } from "../types/adminCompanies.types"

export type CompanyApprovalAction = "approve" | "reject" | "suspend"
export type CompanyApprovalStatusKey = "pending" | "approved" | "rejected" | "suspended"

const KNOWN_ACTIONS: readonly CompanyApprovalAction[] = ["approve", "reject", "suspend"]

// Single temporary fallback: the backend CompanyResource does not expose
// allowed_actions yet, so transitions mirror AdminCompanyStatusService usage.
export const FALLBACK_APPROVAL_TRANSITIONS: Record<
  CompanyApprovalStatusKey,
  readonly CompanyApprovalAction[]
> = {
  pending: ["approve", "reject"],
  approved: ["suspend"],
  suspended: ["approve"],
  rejected: ["approve"],
}

export function getCompanyApprovalActions(company: AdminCompanyRecord): CompanyApprovalAction[] {
  const allowed = (company as { allowed_actions?: unknown }).allowed_actions
  if (Array.isArray(allowed) && allowed.length > 0) {
    const normalized = new Set(allowed.map((action) => keyOf(action)))
    return KNOWN_ACTIONS.filter((action) => normalized.has(action))
  }

  const status = keyOf(company.approval_status ?? company.status) as CompanyApprovalStatusKey
  return [...(FALLBACK_APPROVAL_TRANSITIONS[status] ?? [])]
}
