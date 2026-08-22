import { keyOf } from "@/lib/keyValue"
import type {
  ApplicationStatus,
  ApplicationStatusKey,
  EmployerApplicant,
} from "../types/employerApplicants.types"

export type ApplicationStatusActionsSource = "transitions" | "unavailable"

const WORKFLOW_ONLY_STATUSES: ReadonlySet<ApplicationStatusKey> = new Set([
  "need_more_information",
  "test_pending",
  "interview_scheduled",
  "withdrawn",
])

const TERMINAL_STATUSES: ReadonlySet<ApplicationStatusKey> = new Set([
  "accepted",
  "rejected",
  "withdrawn",
])

export interface ApplicationStatusActions {
  currentStatusKey: ApplicationStatusKey | null
  isTerminal: boolean
  targets: ApplicationStatusKey[]
  source: ApplicationStatusActionsSource
}

function transitionKeys(transitions?: ApplicationStatus[]): ApplicationStatusKey[] {
  if (!transitions?.length) return []
  return transitions.map((status) => keyOf(status) as ApplicationStatusKey).filter(Boolean)
}

export function filterDirectTransitionTargets(
  currentKey: ApplicationStatusKey | null,
  candidates: readonly ApplicationStatusKey[],
): ApplicationStatusKey[] {
  return Array.from(new Set(candidates)).filter(
    (status) => status !== currentKey && !WORKFLOW_ONLY_STATUSES.has(status),
  )
}

export function isTerminalApplicationStatus(statusKey?: string | null): boolean {
  if (!statusKey) return false
  return TERMINAL_STATUSES.has(statusKey as ApplicationStatusKey)
}

export function getApplicationStatusActions(
  application: Pick<EmployerApplicant, "status" | "allowed_status_transitions"> | null | undefined,
): ApplicationStatusActions {
  const currentStatusKey = application?.status
    ? (keyOf(application.status) as ApplicationStatusKey)
    : null

  if (!currentStatusKey || isTerminalApplicationStatus(currentStatusKey)) {
    return { currentStatusKey, isTerminal: true, targets: [], source: "transitions" }
  }

  const fromBackend = filterDirectTransitionTargets(
    currentStatusKey,
    transitionKeys(application?.allowed_status_transitions),
  )

  if (fromBackend.length === 0) {
    return { currentStatusKey, isTerminal: false, targets: [], source: "unavailable" }
  }

  return {
    currentStatusKey,
    isTerminal: false,
    targets: fromBackend,
    source: "transitions",
  }
}
