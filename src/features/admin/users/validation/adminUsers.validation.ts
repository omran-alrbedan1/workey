import { z } from "zod"

export const updateUserRoleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  role: z.enum(["admin", "job_seeker", "employer"]),
})
export const updateUserStatusSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(["active", "suspended"]),
})
