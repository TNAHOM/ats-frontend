"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Upload } from "lucide-react";

interface ApplicationFormProps {
  jobId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ApplicationForm({
  jobId,
  onSuccess,
  onCancel,
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: ApplicationInput) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("job_post_id", jobId);
      formData.append("candidate_name", data.name);
      formData.append("candidate_email", data.email);
      formData.append("candidate_phone", data.phoneNumber);
      formData.append("resume", data.resume);
      formData.append("seniority_level", data.seniority_level);

      const response = await fetch("/api/public/application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      onSuccess();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* seniority_level drop down junior intern, senior */}
        <FormField
          control={form.control}
          name="seniority_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seniority Level</FormLabel>
              <FormControl>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  {...field}
                >
                  <option value="">Select seniority level</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="INTERN">Intern</option>
                  <option value="SENIOR">Senior</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm text-muted-foreground">
                        {fileName || "Click to upload PDF"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setFileName(file.name);
                        }
                      }}
                      disabled={isSubmitting}
                      className="hidden"
                      {...field}
                    />
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            className="flex-1 gradient-brand"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
