import { z } from "zod"

export const informationRequestSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  due_date: z.string().optional(),
})

export type InformationRequestFormValues = z.infer<typeof informationRequestSchema>

export const informationRequestUpdateSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").optional(),
  due_date: z.string().optional(),
})

export type InformationRequestUpdateFormValues = z.infer<typeof informationRequestUpdateSchema>
