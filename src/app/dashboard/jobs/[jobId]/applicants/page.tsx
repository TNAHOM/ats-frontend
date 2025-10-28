"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicantsList } from "@/components/applicants-list";
import { ApplicantDetailSidebar } from "@/components/applicant-detail-sidebar";
import type { Applicant } from "@/lib/types";
import { useParams } from "next/navigation";

export default function Applicants() {
  const params = useParams<{ jobId: string }>();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applicants</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage applicants for this job
          </p>
        </div>
        <Link href={`/dashboard/jobs/${params.jobId}`}>
          <Button variant="outline">Back to Job</Button>
        </Link>
      </div>

      {/* Applicants List */}
      <ApplicantsList
        jobId={params.jobId}
        onSelectApplicant={setSelectedApplicant}
      />

      {/* Applicant Detail Sidebar */}
      <ApplicantDetailSidebar
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
      />
    </div>
  );
}
