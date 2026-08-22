import type { ApplicationStatusKey, EmployerApplicant } from "../types/employerApplicants.types"
import { filterDirectTransitionTargets, getApplicationStatusActions } from "./statusActions"

/** Dedicated (non status-change) flows an employer can trigger on an application. */
export type ApplicationFlowAction = "assign_test" | "schedule_interview" | "request_information"

export interface AllowedApplicationActions {
  /** Direct status-change targets, each rendered as its own action + confirm flow. */
  statusTargets: ApplicationStatusKey[]
  /** Dedicated flows available on this application. */
  flows: ApplicationFlowAction[]
  /** Whether the list was read from the backend `allowed_actions` contract. */
  source: "allowed_actions" | "fallback"
}

const STATUS_KEY_SET: ReadonlySet<string> = new Set<ApplicationStatusKey>([
  "submitted",
  "under_review",
  "shortlisted",
  "test_pending",
  "test_completed",
  "interview_pending",
  "interview_scheduled",
  "interview_completed",
  "final_review",
  "accepted",
  "rejected",
  "withdrawn",
  "on_hold",
  "need_more_information",
])

const FLOW_ALIASES: Record<ApplicationFlowAction, readonly string[]> = {
  assign_test: ["assign_test", "assign_test_assignment", "test_assign", "tests"],
  schedule_interview: [
    "schedule_interview",
    "create_interview",
    "interview_schedule",
    "interviews",
  ],
  request_information: ["request_information", "information_request", "need_more_information"],
}

const BACKEND_STATUS_ACTION_TARGETS: Readonly<Record<string, ApplicationStatusKey>> = {
  start_review: "under_review",
  shortlist: "shortlisted",
  move_to_interview: "interview_pending",
  move_to_final_review: "final_review",
  accept: "accepted",
  reject: "rejected",
  hold: "on_hold",
}

function normalizeAction(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
}

/**
 * Derives the actions available on an application from the backend
 * `allowed_actions` contract. Each recognized entry maps to a specific
 * action-specific flow — never to a generic status selector. When the
 * backend has not sent usable entries yet, falls back to the derived
 * status transitions plus the standard flows for non-terminal states.
 */
export function getAllowedApplicationActions(
  application:
    | Pick<EmployerApplicant, "status" | "allowed_status_transitions" | "allowed_actions">
    | null
    | undefined,
): AllowedApplicationActions {
  const derived = getApplicationStatusActions(application)
  const fallbackFlows: ApplicationFlowAction[] = []

  const hasBackendActions = Array.isArray(application?.allowed_actions)
  const raw = (application?.allowed_actions ?? []).map(normalizeAction).filter(Boolean)
  if (raw.length === 0) {
    if (hasBackendActions) return { statusTargets: [], flows: [], source: "allowed_actions" }
    return { statusTargets: derived.targets, flows: fallbackFlows, source: "fallback" }
  }

  const statusTargets = filterDirectTransitionTargets(
    derived.currentStatusKey,
    raw
      .map((value) => BACKEND_STATUS_ACTION_TARGETS[value] ?? value)
      .filter((value): value is ApplicationStatusKey => STATUS_KEY_SET.has(value)),
  )
  const flows = (Object.keys(FLOW_ALIASES) as ApplicationFlowAction[]).filter((flow) =>
    FLOW_ALIASES[flow].some((alias) => raw.includes(alias)),
  )

  return { statusTargets, flows, source: "allowed_actions" }
}
