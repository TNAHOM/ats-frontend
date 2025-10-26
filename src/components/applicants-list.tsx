"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useApplicants } from "@/hooks/use-applicants"
import type { Applicant, ApplicantStatus } from "@/lib/types"

interface ApplicantsListProps {
  jobId: string
  onSelectApplicant?: (applicant: Applicant) => void
}

export function ApplicantsList({ jobId, onSelectApplicant }: ApplicantsListProps) {
  const { applicants, isLoading, updateApplicantStatus } = useApplicants(jobId)
  const [activeTab, setActiveTab] = useState<ApplicantStatus>("applied")
  const [searchQuery, setSearchQuery] = useState("")
  const [minScore, setMinScore] = useState(0)

  const filteredApplicants = applicants.filter((app) => {
    const matchesTab = app.status === activeTab
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesScore = app.aiScore >= minScore
    return matchesTab && matchesSearch && matchesScore
  })

  const statusConfig = {
    applied: { label: "All Applications", color: "bg-blue-100 text-blue-800" },
    shortlisted: { label: "Shortlisted", color: "bg-green-100 text-green-800" },
    interviewing: { label: "Interviewing", color: "bg-purple-100 text-purple-800" },
    hired: { label: "Hired", color: "bg-emerald-100 text-emerald-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading applicants...</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ApplicantStatus)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applied">Applied ({applicants.filter((a) => a.status === "applied").length})</TabsTrigger>
          <TabsTrigger value="shortlisted">
            Shortlisted ({applicants.filter((a) => a.status === "shortlisted").length})
          </TabsTrigger>
          <TabsTrigger value="interviewing">
            Interviewing ({applicants.filter((a) => a.status === "interviewing").length})
          </TabsTrigger>
          <TabsTrigger value="hired">Hired ({applicants.filter((a) => a.status === "hired").length})</TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({applicants.filter((a) => a.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Search by name or email</label>
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
              <p className="text-muted-foreground">No applicants in this category</p>
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
  )
}

interface ApplicantCardProps {
  applicant: Applicant
  jobId: string
  onSelectApplicant?: (applicant: Applicant) => void
  onStatusChange: (applicantId: string, status: string) => Promise<Applicant | undefined>
}

function ApplicantCard({ applicant, jobId, onSelectApplicant, onStatusChange }: ApplicantCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusChange(applicant.id, newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-lg">{applicant.name}</h3>
            <Badge className="gradient-brand text-white border-0">{applicant.aiScore}% Match</Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Email: {applicant.email}</p>
            <p>Phone: {applicant.phoneNumber}</p>
            <p>Applied: {new Date(applicant.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectApplicant?.(applicant)}>
            View Details
          </Button>
          <select
            value={applicant.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="px-2 py-1 rounded border border-border text-sm disabled:opacity-50"
          >
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewing">Interviewing</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
