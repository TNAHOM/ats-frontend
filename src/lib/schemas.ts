import { z } from "zod";

export const jobCreationSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
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

export const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20),
  resume: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Resume must be less than 5MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Resume must be a PDF file"
    ),
  seniority_level: z.enum(["JUNIOR", "INTERN", "SENIOR"], {
    required_error: "Seniority level is required",
  }),
});

export type JobCreationInput = z.infer<typeof jobCreationSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
