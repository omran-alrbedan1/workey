import { resolveErrorVariant } from "./errorVariant"

describe("resolveErrorVariant", () => {
  it("maps HTTP status codes to their matching variants", () => {
    expect(resolveErrorVariant({ statusCode: 401 })).toBe("401")
    expect(resolveErrorVariant({ statusCode: 403 })).toBe("403")
    expect(resolveErrorVariant({ statusCode: 404 })).toBe("404")
    expect(resolveErrorVariant({ statusCode: 422 })).toBe("422")
    expect(resolveErrorVariant({ statusCode: 500 })).toBe("500")
    expect(resolveErrorVariant({ statusCode: 503 })).toBe("500")
  })

  it("detects timeouts from the error message", () => {
    expect(resolveErrorVariant(new Error("Request timeout"))).toBe("timeout")
    expect(
      resolveErrorVariant({
        message: "Request timeout. The request took too long to complete. Please try again.",
      }),
    ).toBe("timeout")
  })

  it("falls back to the network variant", () => {
    expect(
      resolveErrorVariant({ message: "Network error. Please check your internet connection." }),
    ).toBe("network")
    expect(resolveErrorVariant(undefined)).toBe("network")
    expect(resolveErrorVariant(null)).toBe("network")
    expect(resolveErrorVariant("boom")).toBe("network")
  })

  it("treats non-error objects without status as network failures", () => {
    expect(resolveErrorVariant({})).toBe("network")
    expect(resolveErrorVariant({ message: "" })).toBe("network")
  })
})
