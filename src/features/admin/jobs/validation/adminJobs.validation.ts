import { z } from "zod"
export const adminJobStatusSchema = z.object({
  status: z.enum(["draft", "open", "closed"]),
})
