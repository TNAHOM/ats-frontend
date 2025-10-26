"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/lib/types";

export function useJobDetail(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }

        const data = await response.json();

        setJob(data.response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (jobId) fetchJob();
  }, [jobId]);

  return { job, isLoading, error };
}
