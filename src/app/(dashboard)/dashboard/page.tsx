"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  const { jobs, isLoading } = useJobs();

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job.applicant_count,
    0
  );
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Manage your job postings and applicants
          </p>
        </div>
        <Link href="/jobs/create">
          <Button className="gradient-brand text-white border-0">
            Create Job
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-sm text-muted-foreground">Active Jobs</p>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? "-" : jobs.length}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-sm text-muted-foreground">Total Applicants</p>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? "-" : totalApplicants}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-sm text-muted-foreground">Shortlisted</p>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? "-" : jobs.reduce((sum, job) => sum + 1, 0)}
          </p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : recentJobs.length === 0 ? (
          <p className="text-muted-foreground">
            No jobs created yet.{" "}
            <Link href="/jobs/create" className="text-primary hover:underline">
              Create your first job
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="p-4 border border-border rounded hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.applicant_count} applicants
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
