import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import "@/i18n/config"
import AdminReportsApplications from "./AdminReportsApplications"

describe("AdminReportsApplications", () => {
  it("renders backend localized status counts and normalizes the per-day map", () => {
    render(
      <AdminReportsApplications
        isLoading={false}
        data={{
          total: 12,
          active: 8,
          final: 4,
          accepted: 2,
          rejected: 1,
          by_status: [{ key: "under_review", value: "Under review", count: 5 }],
          per_day: { "2026-08-24": 3 },
        }}
      />,
    )

    expect(screen.getByText("Under review")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })
})
