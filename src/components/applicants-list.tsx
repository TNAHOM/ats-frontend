"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useApplicants } from "@/hooks/use-applicants";
import type { Applicant, ApplicantStatus } from "@/lib/types";
import ApplicantCard from "./ApplicantCard";

interface ApplicantsListProps {
  jobId: string;
  onSelectApplicant?: (applicant: Applicant) => void;
}

export function ApplicantsList({
  jobId,
  onSelectApplicant,
}: ApplicantsListProps) {
  const { applicants, isLoading, updateApplicantStatus } = useApplicants(jobId);
  console.log("Applicants:", applicants);
  const [activeTab, setActiveTab] = useState<ApplicantStatus>("APPLIED");
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(0);

  // const filteredApplicants = applicants.filter((app) => {
  //   const matchesTab = app.status === activeTab;
  //   const matchesSearch =
  //     app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     app.email.toLowerCase().includes(searchQuery.toLowerCase());
  //   // const matchesScore = app.aiScore >= minScore;
  //   return matchesTab && matchesSearch;
  // });
  const filteredApplicants = applicants;
  console.log("Filtered Applicants:", filteredApplicants);

  if (isLoading) {
    return <div className="text-center py-8">Loading applicants...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ApplicantStatus)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applied">
            Applied ({applicants.filter((a) => a.status === "APPLIED").length})
          </TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted (
            {applicants.filter((a) => a.status === "SHORTLISTED").length})
          </TabsTrigger>
          <TabsTrigger value="interviewing">
            Interviewing (
            {applicants.filter((a) => a.status === "INTERVIEWING").length})
          </TabsTrigger>
          <TabsTrigger value="hired">
            Hired ({applicants.filter((a) => a.status === "HIRED").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({applicants.filter((a) => a.status === "REJECTED").length}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">
                  Search by name or email
                </label>
                <Input
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Minimum AI Score</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="mt-1 w-32"
                />
              </div>
            </div>
          </Card>

          {/* Applicants List */}
          {filteredApplicants.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No applicants in this category
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  jobId={jobId}
                  onSelectApplicant={onSelectApplicant}
                  onStatusChange={updateApplicantStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
