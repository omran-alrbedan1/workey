import { describe, expect, it } from "vitest"
import { resolveApiLanguage } from "./api"

describe("resolveApiLanguage", () => {
  it.each([
    ["ar", "ar"],
    ["ar-SY", "ar"],
    ["ar-SA", "ar"],
    ["en", "en"],
    ["en-US", "en"],
    ["fr-FR", "en"],
    [undefined, "en"],
  ] as const)("normalizes %s to %s", (locale, expected) => {
    expect(resolveApiLanguage(locale)).toBe(expected)
  })
})
