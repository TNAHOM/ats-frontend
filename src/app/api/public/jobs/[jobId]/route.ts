import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const BaseURL = (globalThis as any).process?.env?.BaseUrl;

    const jobId = params.jobId;

    if (!jobId) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    const response = await fetch(
      `${BaseURL}/jobPost/getJobPostByID/${jobId}`
    ).then((res) => res.json());

    if (response?.errorMessage) {
      return NextResponse.json(
        { error: response.errorMessage },
        { status: response.Code ?? 500 }
      );
    }

    return NextResponse.json({ response: response.data });
  } catch (error) {
    console.error("Error fetching public job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}