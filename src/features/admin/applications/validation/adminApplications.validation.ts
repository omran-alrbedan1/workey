import { z } from "zod"
export const applicationStatusSchema = z.object({
  status: z.string().min(1),
  note: z.string().max(1000).optional(),
})
