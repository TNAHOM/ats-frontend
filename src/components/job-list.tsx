"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobs } from "@/hooks/use-jobs";

export function JobList() {
  const { jobs, isLoading } = useJobs();

  if (isLoading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No jobs created yet</p>
        <Link href="/jobs/create">
          <Button className="gradient-brand text-white border-0">
            Create Your First Job
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const isDeadlinePassed = new Date(job.deadline) < new Date();

        return (
          <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  {isDeadlinePassed && (
                    <Badge variant="destructive">Closed</Badge>
                  )}
                </div>

                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Applicants: </span>
                    <span className="font-semibold">{job.applicant_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Posted: </span>
                    <span className="font-semibold">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deadline: </span>
                    <span
                      className={`font-semibold ${
                        isDeadlinePassed ? "text-destructive" : ""
                      }`}
                    >
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Link href={`/jobs/${job.id}/applicants`}>
                  <Button className="gradient-brand text-white border-0">
                    View Applicants
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
