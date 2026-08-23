import { z } from "zod"

export const companyDecisionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  decision: z.enum(["approve", "reject"]),
})
