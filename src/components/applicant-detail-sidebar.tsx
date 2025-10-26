"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Applicant } from "@/lib/types"

interface ApplicantDetailSidebarProps {
  applicant: Applicant | null
  onClose: () => void
}

export function ApplicantDetailSidebar({ applicant, onClose }: ApplicantDetailSidebarProps) {
  if (!applicant) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-card border-l border-border shadow-lg overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <h2 className="font-bold text-lg">Applicant Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Name and Score */}
        <ApplicantHeader applicant={applicant} />

        {/* Contact Information */}
        <ContactCard applicant={applicant} />

        {/* Resume */}
        <ResumeCard applicant={applicant} />

        {/* Cover Letter */}
        <CoverLetterCard applicant={applicant} />

        {/* Application Date */}
        <ApplicationDateCard applicant={applicant} />
      </div>
    </div>
  )
}

function ApplicantHeader({ applicant }: { applicant: Applicant }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">{applicant.name}</h3>
      <Badge className="gradient-brand text-white border-0">{applicant.aiScore}% Match</Badge>
    </div>
  )
}

function ContactCard({ applicant }: { applicant: Applicant }) {
  return (
    <Card className="p-4">
      <h4 className="font-bold mb-3">Contact Information</h4>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <a href={`mailto:${applicant.email}`} className="text-primary hover:underline">
            {applicant.email}
          </a>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <a href={`tel:${applicant.phoneNumber}`} className="text-primary hover:underline">
            {applicant.phoneNumber}
          </a>
        </div>
      </div>
    </Card>
  )
}

function ResumeCard({ applicant }: { applicant: Applicant }) {
  return (
    <Card className="p-4">
      <h4 className="font-bold mb-3">Resume</h4>
      {applicant.resume ? (
        <a href={applicant.resume} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
          <Button variant="outline" className="w-full bg-transparent">
            View Resume
          </Button>
        </a>
      ) : (
        <p className="text-muted-foreground text-sm">No resume provided</p>
      )}
    </Card>
  )
}

function CoverLetterCard({ applicant }: { applicant: Applicant }) {
  return (
    <Card className="p-4">
      <h4 className="font-bold mb-3">Cover Letter</h4>
      {applicant.coverLetter ? (
        <p className="text-sm whitespace-pre-wrap">{applicant.coverLetter}</p>
      ) : (
        <p className="text-muted-foreground text-sm">No cover letter provided</p>
      )}
    </Card>
  )
}

function ApplicationDateCard({ applicant }: { applicant: Applicant }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">Applied on</p>
      <p className="font-semibold">{new Date(applicant.createdAt).toLocaleDateString()}</p>
    </Card>
  )
}
