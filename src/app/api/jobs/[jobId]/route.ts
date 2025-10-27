import { type NextRequest, NextResponse } from "next/server";
import { getMockJobById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;

    const BaseURL = process.env.BaseUrl;
    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;

    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const response = await fetch(`${BaseURL}/jobPost/getJobPostByID/${jobId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    if (response.errorMessage) {
      return NextResponse.json(
        { error: response.errorMessage },
        { status: response.Code }
      );
    }

    return NextResponse.json({ response: response.data });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = await params.jobId;
    if (!jobId) {
      return NextResponse.json(
        { error: "Missing job id in query parameters" },
        { status: 400 }
      );
    }

    const BaseURL = process.env.BaseUrl;

    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;

    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const response = await fetch(`${BaseURL}/jobPost/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    console.log("API Delete Response:", response);
    if (response.errorMessage) {
      return NextResponse.json(
        { error: response.errorMessage },
        { status: response.Code }
      );
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
