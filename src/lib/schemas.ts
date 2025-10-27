import { z } from "zod";

export const jobCreationSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  // requirements: z
  //   .string()
  //   .min(10, "Requirements must be at least 10 characters")
  //   .transform((val) => val.split("\n").filter((line) => line.trim())),
  requirements: z
    .array(
      z.object({
        value: z
          .string()
          .min(3, "Each requirement must be at least 3 characters"),
      })
    )
    .min(1, "At least one requirement is required"),

  responsibilities: z
    .array(
      z.object({
        value: z
          .string()
          .min(10, "Each responsibility must be at least 10 characters"),
      })
    )
    .min(1, "At least one responsibility is required"),

  deadline: z
    .string()
    .refine(
      (date) => new Date(date).toISOString() > new Date().toISOString(),
      "Deadline must be in the future"
    ),
});

export type JobCreationInput = z.infer<typeof jobCreationSchema>;
