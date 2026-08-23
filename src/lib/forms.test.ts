import { applyApiValidationErrors, rootFormError } from "./forms"
import type { FieldPath, UseFormSetError } from "react-hook-form"

type Values = {
  email: string
  company_name: string
}

type SetErrorCall = { field: string; type: string; message: string }

function createSetError() {
  const calls: SetErrorCall[] = []
  const setError = ((field: FieldPath<Values>, error: { type?: string; message?: string }) => {
    calls.push({
      field: String(field),
      type: String(error.type),
      message: String(error.message),
    })
  }) as unknown as UseFormSetError<Values>
  return { setError, calls }
}

describe("applyApiValidationErrors", () => {
  it("maps backend validation errors onto form fields", () => {
    const { setError, calls } = createSetError()
    const error = {
      errors: {
        email: ["The email has already been taken."],
        company_name: ["The company name field is required."],
      },
    }

    const applied = applyApiValidationErrors<Values>(setError, error)

    expect(applied).toBe(true)
    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({
      field: "email",
      type: "server",
      message: "The email has already been taken.",
    })
    expect(calls[1]?.field).toBe("company_name")
  })

  it("unwraps nested arrays and picks the first message", () => {
    const { setError, calls } = createSetError()
    const error = { errors: { email: [["First message", "Second message"]] } }

    applyApiValidationErrors<Values>(setError, error)

    expect(calls[0]?.message).toBe("First message")
  })

  it("returns false when the error carries no validation errors", () => {
    const { setError, calls } = createSetError()

    expect(applyApiValidationErrors<Values>(setError, new Error("Network down"))).toBe(false)
    expect(applyApiValidationErrors<Values>(setError, { errors: null })).toBe(false)
    expect(applyApiValidationErrors<Values>(setError, { errors: {} })).toBe(false)
    expect(calls).toHaveLength(0)
  })
})

describe("rootFormError", () => {
  it("attaches a server message to the root pseudo-field", () => {
    const { setError, calls } = createSetError()

    rootFormError<Values>(setError, "Something went wrong")

    expect(calls[0]).toEqual({ field: "root", type: "server", message: "Something went wrong" })
  })
})
