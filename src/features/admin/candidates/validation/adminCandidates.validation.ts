import { z } from "zod"

export const candidateStatusSchema = z.enum(["active", "suspended"])
