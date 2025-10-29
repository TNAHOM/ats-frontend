"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { useJobDetail } from "@/hooks/use-job-detail";

interface JobDetailProps {
  jobId: string;
}

const PublicJobDetails = ({ jobId }: JobDetailProps) => {
  const params = useParams<{ jobId: string | string[] }>();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationSuccess, setIsApplicationSuccess] = useState(false);

  const effectiveJobId = useMemo(() => {
    if (jobId) return jobId;
    const fromParams = params?.jobId;
    return Array.isArray(fromParams) ? fromParams[0] : fromParams;
  }, [jobId, params]);

  const { job, isLoading, error } = useJobDetail(effectiveJobId);

  const deadlinePassed = useMemo(() => {
    if (!job?.deadline) return false;
    return new Date(job.deadline).getTime() < Date.now();
  }, [job?.deadline]);

  const handleApplicationSuccess = () => {
    setIsModalOpen(false);
    setIsApplicationSuccess(true);
    setTimeout(() => {
      router.push("/public/jobs");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Job not found"}</p>
          <Button onClick={() => router.push("/public/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/public/jobs")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      {isApplicationSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">
                  Application Submitted Successfully!
                </p>
                <p className="text-sm">Redirecting to jobs list...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                {job.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Application Deadline:{" "}
              {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full gradient-brand"
            size="lg"
            disabled={isApplicationSuccess || deadlinePassed}
          >
            Apply Now
          </Button>
        </CardContent>
      </Card>

      <ApplicationModal
        isOpen={isModalOpen}
        jobId={job.id}
        jobTitle={job.title}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default PublicJobDetails;
