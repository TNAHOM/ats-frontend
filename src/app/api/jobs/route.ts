import { type NextRequest, NextResponse } from "next/server";
import { jobCreationSchema } from "@/lib/schemas";

import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const BaseURL = process.env.BaseUrl;

    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;
    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const body = await request.json();
    // const validatedData = jobCreationSchema.parse(body);

    const response = await fetch(`${BaseURL}/jobPost/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    console.log("API Response:", response);
    if (response.errorMessage) {
      return NextResponse.json(
        { error: response.errorMessage },
        { status: response.Code }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const BaseURL = process.env.BaseUrl;

    const cookieStore = await cookies();
    const atsToken = cookieStore.get("ats-token")?.value;
    if (!atsToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const accessToken = JSON.parse(atsToken).token;

    const body = await request.json();
    // Expecting body to contain at least an `id` and the updatable fields
    if (!body?.id) {
      return NextResponse.json(
        { error: "Missing job id in request body" },
        { status: 400 }
      );
    }

    const { id, ...restFields } = body;

    const response = await fetch(`${BaseURL}/jobPost/update/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restFields),
    }).then((res) => res.json());

    console.log("API Update Response:", response);
    if (response.errorMessage) {
      return NextResponse.json(
        { error: response.errorMessage },
        { status: response.Code }
      );
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
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
