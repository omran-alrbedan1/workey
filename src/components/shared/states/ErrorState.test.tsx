import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import "@/i18n/config"
import ErrorState from "./ErrorState"

describe("ErrorState", () => {
  it("renders the default variant with a retry action", async () => {
    const retry = vi.fn()
    render(<ErrorState variant="default" error={new Error("boom")} retry={retry} />)

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it("renders status-specific titles for forbidden and not-found variants", () => {
    const { unmount } = render(<ErrorState variant="403" showDefaultActions={false} />)
    expect(screen.getByText(/access denied/i)).toBeInTheDocument()
    unmount()

    render(<ErrorState variant="404" showDefaultActions={false} />)
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it("shows the backend message for validation errors", () => {
    render(
      <ErrorState variant="422" error="The title field is required." showDefaultActions={false} />,
    )
    expect(screen.getByText("The title field is required.")).toBeInTheDocument()
  })
})
