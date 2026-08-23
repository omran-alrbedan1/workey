import { z } from "zod"
export const adminSettingsSchema = z.object({
  defaultLocale: z.enum(["en", "ar"]),
  defaultTheme: z.enum(["light", "dark", "system"]),
  pageSize: z.number().int().positive(),
})
