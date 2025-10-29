import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { getMockJobById, getMockApplicantsByJobId } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = getMockJobById(jobId)
    if (!job || job.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const jobApplicants = getMockApplicantsByJobId(jobId)
    return NextResponse.json(jobApplicants)
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }
}
