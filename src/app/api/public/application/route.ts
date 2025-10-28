import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const BaseURL = (globalThis as any).process?.env?.BaseUrl;

    const incomingFormData = await request.formData();
    const resume = incomingFormData.get("resume");

    if (!(resume instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    const uploadFormData = new FormData();
    for (const [key, value] of incomingFormData.entries()) {
      if (value instanceof File) {
        const upstreamKey = key === "resume" ? "file" : key;
        uploadFormData.append(upstreamKey, value, value.name);
      } else if (typeof value === "string") {
        uploadFormData.append(key, value);
      }
    }

    const upstreamResponse = await fetch(`${BaseURL}/resumes/upload`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!upstreamResponse.ok) {
      const errorBody = await upstreamResponse.text();
      console.error("Resume upload failed", {
        status: upstreamResponse.status,
        body: errorBody,
      });
      return NextResponse.json(
        { error: "Failed to upload resume" },
        { status: upstreamResponse.status }
      );
    }

    const payload = await upstreamResponse.json().catch(() => null);

    if (payload?.errorMessage) {
      return NextResponse.json(
        { error: payload.errorMessage },
        { status: payload.Code ?? 500 }
      );
    }

    return NextResponse.json({ response: payload?.data ?? payload });
  } catch (error) {
    console.error("Error handling application submission", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
