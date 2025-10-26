import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("ats-token")?.value;
    if (!token) {
      return NextResponse.json({ error: token }, { status: 401 });
    }

    const user = JSON.parse(token);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
