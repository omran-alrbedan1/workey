import { keyOf } from "@/lib/keyValue"

import type { AdminCompanyRecord } from "../types/adminCompanies.types"

export type CompanyApprovalAction = "approve" | "reject" | "suspend"

const KNOWN_ACTIONS: readonly CompanyApprovalAction[] = ["approve", "reject", "suspend"]

export function getCompanyApprovalActions(company: AdminCompanyRecord): CompanyApprovalAction[] {
  const allowed = (company as { allowed_actions?: unknown }).allowed_actions
  if (!Array.isArray(allowed) || allowed.length === 0) {
    return []
  }

  const normalized = new Set(allowed.map((action) => keyOf(action)))
  return KNOWN_ACTIONS.filter((action) => normalized.has(action))
}
