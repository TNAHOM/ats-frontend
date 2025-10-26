"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { jobCreationSchema, type JobCreationInput } from "@/lib/schemas"

export function JobCreationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<JobCreationInput>({
    resolver: zodResolver(jobCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      responsibilities: "",
      deadline: "",
    },
  })

  async function onSubmit(data: JobCreationInput) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create job")

      const job = await response.json()
      router.push(`/jobs/${job.id}`)
    } catch (error) {
      console.error("Error creating job:", error)
      form.setError("root", { message: "Failed to create job. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground mt-2">Post a new job opening and start receiving applications</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior React Developer" {...field} />
                  </FormControl>
                  <FormDescription>The position title for this job opening</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the job role, company, and what makes this position unique..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a comprehensive overview of the position</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter each requirement on a new line&#10;e.g.&#10;5+ years of React experience&#10;Strong TypeScript skills&#10;Experience with Next.js"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>List one requirement per line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responsibilities */}
            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter each responsibility on a new line&#10;e.g.&#10;Build scalable web applications&#10;Lead code reviews&#10;Mentor junior developers"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>List one responsibility per line</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Application Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Deadline</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>When should applications close?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-brand text-white border-0" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Job"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
