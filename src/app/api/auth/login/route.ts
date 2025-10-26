import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const BaseUrl = process.env.BaseUrl;
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // const user = await mockLogin(email, password)
    const response = await fetch(`${BaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json());

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 401 });
    }

    // Set auth token in cookie (you can replace with your own token)
    const cookieStore = await cookies();
    cookieStore.set("ats-token", JSON.stringify(response.data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      data: response.data,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
