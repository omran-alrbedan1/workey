import { describe, expect, it } from "vitest"
import { getAllowedApplicationActions } from "./applicationActions"

const application = (status: string, allowedActions: string[]) =>
  ({
    status: { id: status, key: status, value: status },
    allowed_actions: allowedActions,
  }) as Parameters<typeof getAllowedApplicationActions>[0]

describe("getAllowedApplicationActions", () => {
  it("maps only API-provided direct and workflow actions", () => {
    expect(
      getAllowedApplicationActions(application("submitted", ["start_review", "assign_test"])),
    ).toEqual({
      statusTargets: ["under_review"],
      flows: ["assign_test"],
      source: "allowed_actions",
    })
  })

  it("does not expose actions for a terminal application", () => {
    expect(
      getAllowedApplicationActions(application("accepted", ["reject", "schedule_interview"])),
    ).toEqual({
      statusTargets: [],
      flows: [],
      source: "allowed_actions",
    })
  })
})
