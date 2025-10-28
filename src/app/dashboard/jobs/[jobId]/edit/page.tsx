"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useJobDetail } from "@/hooks/use-job-detail";
import { JobCreationForm } from "@/components/job-creation-form";
import { useParams } from "next/navigation";

export default function EditJobPage() {
  const param = useParams<{ jobId: string }>();
  const { job, isLoading, error } = useJobDetail(param.jobId);

  if (isLoading) {
    return <div className="text-center py-8">Loading job...</div>;
  }

  if (error || !job) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error || "Job not found"}</p>
        <Link href={`/dashboard/jobs/${param.jobId}`}>
          <Button variant="outline">Back to Job</Button>
        </Link>
      </Card>
    );
  }

  const initialValues = {
    title: job.title,
    description: job.description,
    requirements: job.requirements || [],
    responsibilities: job.responsibilities || [],
    deadline:
      typeof job.deadline === "string"
        ? job.deadline
        : new Date(job.deadline).toISOString(),
  };

  return (
    <div className="space-y-6">
      <JobCreationForm
        mode="edit"
        jobId={job.id}
        initialValues={initialValues}
      />
    </div>
  );
}
