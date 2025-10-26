"use client"

import { useEffect, useState } from "react"
import type { Applicant } from "@/lib/types"

export function useApplicants(jobId: string) {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/jobs/${jobId}/applicants`)
        if (!response.ok) throw new Error("Failed to fetch applicants")
        const data = await response.json()
        // Sort by AI score descending
        data.sort((a: Applicant, b: Applicant) => b.aiScore - a.aiScore)
        setApplicants(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setApplicants([])
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) fetchApplicants()
  }, [jobId])

  const updateApplicantStatus = async (applicantId: string, status: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/applicants/${applicantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update applicant")
      const updatedApplicant = await response.json()
      setApplicants((prev) => prev.map((a) => (a.id === applicantId ? updatedApplicant : a)))
      return updatedApplicant
    } catch (err) {
      console.error("Error updating applicant:", err)
      throw err
    }
  }

  return { applicants, isLoading, error, updateApplicantStatus }
}
