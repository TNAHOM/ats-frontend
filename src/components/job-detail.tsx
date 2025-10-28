"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobDetail } from "@/hooks/use-job-detail";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface JobDetailProps {
  jobId: string;
}

export function JobDetail({ jobId }: JobDetailProps) {
  const params = useParams<{ jobId: string | string[] }>();
  const { jobId: currentJobId } = params;
  const { job, isLoading, error } = useJobDetail(currentJobId as string);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <div className="text-center py-8">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error || "Job not found"}</p>
        <Link href="/dashboard/jobs">
          <Button variant="outline">Back to Jobs</Button>
        </Link>
      </Card>
    );
  }

  const isDeadlinePassed = new Date(job.deadline) < new Date();

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());

      if (response.error) {
        throw new Error("Failed to delete the job application");
      }

      router.push("/dashboard/jobs");
    } catch {
      console.error("Error Deleting the job application");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            {isDeadlinePassed && (
              <Badge variant="destructive">Application Closed</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Posted on {new Date(job.created_at).toLocaleDateString()} •
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={isDeadlinePassed || isDeleteLoading}
          >
            <Link href={`/dashboard/jobs/${job.id}/edit`}>Update</Link>
          </Button>
          <div>
            <Button
              variant="outline"
              className="text-destructive"
              onClick={handleDelete}
              disabled={isDeleteLoading}
            >
              Delete
            </Button>
          </div>
          <Link href={`/dashboard/jobs/${job.id}/applicants`}>
            <Button className="gradient-brand text-white border-0">
              View Applicants
            </Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-3">Job Description</h2>
        <p className="text-foreground whitespace-pre-wrap">{job.description}</p>
      </Card>

      {/* Requirements */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Requirements</h2>
        <ul className="space-y-2">
          {job.requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Responsibilities */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
        <ul className="space-y-2">
          {job.responsibilities.map((resp, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Share Job Link */}
      <ShareJobLink jobId={job.id} />

      {/* Back Button */}
      <Link href="/dashboard/jobs">
        <Button variant="outline">Back to Jobs</Button>
      </Link>
    </div>
  );
}

function ShareJobLink({ jobId }: { jobId: string }) {
  const handleCopyLink = () => {
    const url = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/apply/${jobId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Card className="p-6 bg-primary/5">
      <h2 className="text-xl font-bold mb-3">Share This Job</h2>
      <p className="text-muted-foreground mb-4">
        Share this link with candidates on LinkedIn or other job boards:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={`${
            typeof window !== "undefined" ? window.location.origin : ""
          }/apply/${jobId}`}
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
        />
        <Button variant="outline" onClick={handleCopyLink}>
          Copy Link
        </Button>
      </div>
    </Card>
  );
}
