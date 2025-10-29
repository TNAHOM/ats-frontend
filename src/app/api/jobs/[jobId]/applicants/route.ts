import { type NextRequest, NextResponse } from "next/server";
import { getMockJobById, getMockApplicantsByJobId } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const BaseURL = process.env.BaseUrl;
    const { jobId } = await params;
    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;

    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const response = await fetch(
      `${BaseURL}/applications/jobPostByID/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());

    if (response.errorMessage || response.error) {
      return NextResponse.json(
        { error: response.errorMessage || response.error },
        { status: response.Code }
      );
    }

    const jobApplicants = response.data;
    return NextResponse.json(jobApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
