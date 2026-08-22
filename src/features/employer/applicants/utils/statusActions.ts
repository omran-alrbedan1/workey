import { keyOf } from "@/lib/keyValue"
import type {
  ApplicationStatus,
  ApplicationStatusKey,
  EmployerApplicant,
} from "../types/employerApplicants.types"

export type ApplicationStatusActionsSource = "transitions" | "fallback"

/**
 * Statuses that are never direct "change status" targets in the UI.
 * Each one is produced by its own dedicated flow:
 * - need_more_information → Information Request flow
 * - test_pending          → Assign Test action
 * - interview_scheduled   → Create/Schedule Interview action
 * - withdrawn             → Job seeker only
 */
const WORKFLOW_ONLY_STATUSES: ReadonlySet<ApplicationStatusKey> = new Set([
  "need_more_information",
  "test_pending",
  "interview_scheduled",
  "withdrawn",
])

/** Final states: no further actions are offered. */
const TERMINAL_STATUSES: ReadonlySet<ApplicationStatusKey> = new Set([
  "accepted",
  "rejected",
  "withdrawn",
])

/**
 * Temporary fallback used ONLY while the backend does not send
 * `allowed_status_transitions`. This is the single copy of the state
 * machine in the frontend — do not duplicate it elsewhere.
 */
const FALLBACK_TRANSITIONS: Partial<Record<ApplicationStatusKey, ApplicationStatusKey[]>> = {
  submitted: ["under_review", "shortlisted", "on_hold", "rejected"],
  under_review: ["shortlisted", "final_review", "on_hold", "rejected"],
  shortlisted: ["final_review", "on_hold", "rejected"],
  test_completed: ["interview_pending", "final_review", "on_hold", "rejected"],
  interview_pending: ["final_review", "on_hold", "rejected"],
  interview_completed: ["final_review", "on_hold", "rejected"],
  final_review: ["accepted", "rejected"],
  on_hold: ["under_review", "shortlisted", "final_review", "rejected"],
}

export interface ApplicationStatusActions {
  currentStatusKey: ApplicationStatusKey | null
  isTerminal: boolean
  /** Direct status-change targets the backend allows, ready to render. */
  targets: ApplicationStatusKey[]
  source: ApplicationStatusActionsSource
}

function transitionKeys(transitions?: ApplicationStatus[]): ApplicationStatusKey[] {
  if (!transitions?.length) return []
  return transitions
    .map((status) => keyOf(status) as ApplicationStatusKey)
    .filter(Boolean)
}

/**
 * Keeps only statuses that may be offered as direct "change status" actions:
 * unique, not the current status, and never workflow-only
 * (those are produced by their own dedicated flows instead).
 */
export function filterDirectTransitionTargets(
  currentKey: ApplicationStatusKey | null,
  candidates: readonly ApplicationStatusKey[],
): ApplicationStatusKey[] {
  return Array.from(new Set(candidates)).filter(
    (status) =>
      status !== currentKey &&
      !WORKFLOW_ONLY_STATUSES.has(status),
  )
}

export function isTerminalApplicationStatus(statusKey?: string | null): boolean {
  if (!statusKey) return false
  return TERMINAL_STATUSES.has(statusKey as ApplicationStatusKey)
}

/**
 * Derives the status-change actions an employer may perform on an
 * application, based on backend data (`allowed_status_transitions`).
 * Falls back to a single conservative state machine only when the
 * backend field has not arrived yet.
 */
export function getApplicationStatusActions(
  application: Pick<EmployerApplicant, "status" | "allowed_status_transitions"> | null | undefined,
): ApplicationStatusActions {
  const currentStatusKey = application?.status
    ? (keyOf(application.status) as ApplicationStatusKey)
    : null

  if (!currentStatusKey || isTerminalApplicationStatus(currentStatusKey)) {
    return { currentStatusKey, isTerminal: true, targets: [], source: "transitions" }
  }

  const fromBackend = transitionKeys(application?.allowed_status_transitions)
  const rawTargets =
    fromBackend.length > 0
      ? fromBackend
      : (FALLBACK_TRANSITIONS[currentStatusKey] ?? [])

  const targets = filterDirectTransitionTargets(currentStatusKey, rawTargets)

  return {
    currentStatusKey,
    isTerminal: false,
    targets,
    source: fromBackend.length > 0 ? "transitions" : "fallback",
  }
}
