"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { jobCreationSchema, type JobCreationInput } from "@/lib/schemas";

type JobInitialValues = {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  deadline: string; // ISO string
};

export function JobCreationForm({
  mode = "create",
  jobId,
  initialValues,
}: {
  mode?: "create" | "edit";
  jobId?: string;
  initialValues?: JobInitialValues;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toLocalDatetime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const form = useForm<JobCreationInput>({
    resolver: zodResolver(jobCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: [{ value: "" }],
      responsibilities: [{ value: "" }],
      deadline: "",
    },
  });

  // Prefill in edit mode when initialValues are provided
  useEffect(() => {
    if (mode === "edit" && initialValues) {
      const mapped = {
        title: initialValues.title || "",
        description: initialValues.description || "",
        requirements:
          initialValues.requirements?.map((r) => ({ value: r }))?.length > 0
            ? initialValues.requirements.map((r) => ({ value: r }))
            : [{ value: "" }],
        responsibilities:
          initialValues.responsibilities?.map((r) => ({ value: r }))?.length > 0
            ? initialValues.responsibilities.map((r) => ({ value: r }))
            : [{ value: "" }],
        deadline: toLocalDatetime(initialValues.deadline),
      } satisfies JobCreationInput as any;
      form.reset(mapped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, JSON.stringify(initialValues)]);

  const {
    fields: requirementFields,
    append: requirementAppend,
    remove: requirementRemove,
  } = useFieldArray({
    name: "requirements",
    control: form.control,
  });

  const {
    fields: responsibilityFields,
    append: responsibilityAppend,
    remove: responsibilityRemove,
  } = useFieldArray({
    name: "responsibilities",
    control: form.control,
  });

  async function onSubmit(data: JobCreationInput) {
    setIsLoading(true);

    const cleanedData = {
      ...data,
      deadline: new Date(data.deadline).toISOString(),
      requirements: data.requirements.map((req) => req.value),
      responsibilities: data.responsibilities.map((res) => res.value),
    };
    try {
      const endpoint = "/api/jobs";
      const method = mode === "edit" ? "PATCH" : "POST";
      const payload =
        mode === "edit"
          ? JSON.stringify({ id: jobId, ...cleanedData })
          : JSON.stringify(cleanedData);

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).then((res) => res.json());

      console.log("API Response job form:", response);
      if (response.error) {
        throw new Error(
          mode === "edit" ? "Failed to update job" : "Failed to create job"
        );
      }

      const newOrExistingJobId =
        jobId || response?.data?.id || response?.data?.job?.id;
      router.push(`/jobs/${newOrExistingJobId}`);
    } catch (error) {
      console.error(
        mode === "edit" ? "Error updating job:" : "Error creating job:",
        error
      );
      form.setError("root", {
        message:
          mode === "edit"
            ? "Failed to update job. Please try again."
            : "Failed to create job. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {mode === "edit" ? "Update Job" : "Create New Job"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "edit"
              ? "Make changes to your job posting"
              : "Post a new job opening and start receiving applications"}
          </p>
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
                    <Input
                      placeholder="e.g., Senior React Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The position title for this job opening
                  </FormDescription>
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
                  <FormDescription>
                    Provide a comprehensive overview of the position
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requirements */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <FormLabel>Requirements</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => requirementAppend({ value: "" })}
                >
                  Add Requirement
                </Button>
              </div>
              {requirementFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`requirements.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormControl className="w-full">
                          <div className="w-full flex gap-3">
                            <Input
                              placeholder="Enter requirements on a new line"
                              className="w-full"
                              type="text"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => requirementRemove(index)}
                              className="w-fit"
                            >
                              Remove
                            </Button>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormDescription>
                E.g: &#10;5+ years of React experience&#10;Strong TypeScript
                skills&#10;Experience with Next.js
              </FormDescription>
            </div>

            {/* Responsibilities */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <FormLabel>Responsibilities</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => responsibilityAppend({ value: "" })}
                >
                  Add Responsibility
                </Button>
              </div>
              {responsibilityFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`responsibilities.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full flex gap-3">
                          <Input type="text" className="w-full" {...field} />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => responsibilityRemove(index)}
                            className="w-fit"
                          >
                            Remove
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormDescription>
                Enter each responsibility on a new line&#10;e.g.&#10;Build
                scalable web applications&#10;Lead code reviews&#10;Mentor
                junior developers
              </FormDescription>
            </div>

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
                  <FormDescription>
                    When should applications close?
                  </FormDescription>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-brand text-white border-0"
                disabled={isLoading}
              >
                {isLoading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Creating..."
                  : mode === "edit"
                  ? "Update Job"
                  : "Create Job"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
