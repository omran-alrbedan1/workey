import { z } from "zod"

export const employerStatusSchema = z.enum(["active", "suspended"])
