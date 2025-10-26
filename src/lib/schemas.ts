import { z } from "zod"

export const jobCreationSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters")
    .transform((val) => val.split("\n").filter((line) => line.trim())),
  responsibilities: z
    .string()
    .min(10, "Responsibilities must be at least 10 characters")
    .transform((val) => val.split("\n").filter((line) => line.trim())),
  deadline: z.string().refine((date) => new Date(date) > new Date(), "Deadline must be in the future"),
})

export type JobCreationInput = z.infer<typeof jobCreationSchema>
