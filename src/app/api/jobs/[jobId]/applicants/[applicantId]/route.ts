import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { getMockJobById, getMockApplicantById, updateMockApplicantStatus } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { jobId: string; applicantId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = getMockJobById(params.jobId)
    if (!job || job.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const applicant = getMockApplicantById(params.applicantId)
    if (!applicant || applicant.jobId !== params.jobId) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    const body = await request.json()
    const updatedApplicant = updateMockApplicantStatus(params.applicantId, body.status)

    return NextResponse.json(updatedApplicant)
  } catch (error) {
    console.error("Error updating applicant:", error)
    return NextResponse.json({ error: "Failed to update applicant" }, { status: 500 })
  }
}
