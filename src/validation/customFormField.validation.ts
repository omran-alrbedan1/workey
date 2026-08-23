import { z } from "zod"

export const createValidationSchema = () => ({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  requiredString: z.string().min(1, "This field is required"),
  requiredNumber: z.number().min(1, "This field is required"),
  requiredArray: z.array(z.string()).min(1, "Select at least one option"),
  requiredFile: z.instanceof(File, { message: "File is required" }),
  requiredDate: z.date({ message: "Date is required" }),
  url: z.string().url("Invalid URL"),
  min: (min: number) => z.string().min(min, `Must be at least ${min} characters`),
  max: (max: number) => z.string().max(max, `Must be no more than ${max} characters`),
  between: (min: number, max: number) => z.number().min(min).max(max),
  pattern: (regex: RegExp, message: string) => z.string().regex(regex, message),
})
