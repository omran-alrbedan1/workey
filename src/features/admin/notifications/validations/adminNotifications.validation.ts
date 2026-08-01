import { z } from "zod"
export const notificationIdSchema = z.union([z.string(), z.number()])
