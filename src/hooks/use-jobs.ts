"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchJobs();
    }
  }, [user]);

  return { jobs, isLoading, error };
}
