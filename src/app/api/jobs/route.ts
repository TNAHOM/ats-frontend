import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { jobCreationSchema } from "@/lib/schemas";
import { getMockJobs } from "@/lib/db";
import { mockJobs } from "@/lib/mockdata";
import { v4 as uuidv4 } from "uuid";
import type { Job } from "@/lib/types";

import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = jobCreationSchema.parse(body);

    const job: Job = {
      id: uuidv4(),
      user_id: userId,
      title: validatedData.title,
      description: validatedData.description,
      requirements: validatedData.requirements,
      responsibilities: validatedData.responsibilities,
      deadline: new Date(validatedData.deadline),
      created_at: new Date(),
      updated_at: new Date(),
      applicant_count: 0,
    };

    // Add to mock data
    mockJobs.push(job);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const BaseURL = process.env.BaseUrl;
    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;

    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const response = await fetch(`${BaseURL}/jobPost/getAllJobPosts`, {
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
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
