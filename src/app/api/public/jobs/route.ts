import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const BaseURL = process.env.BaseUrl;
    // const cookieStore = await cookies();
    // const atsToken = cookieStore.get("ats-token")?.value;

    // if (!atsToken) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const response = await fetch(`${BaseURL}/jobPost/getAllJobPosts`).then(
      (res) => res.json()
    );

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
