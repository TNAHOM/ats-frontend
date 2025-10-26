import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/jobs", "/applicants"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ats-token")?.value;
  console.log("Middleware token:", token);
  // If user is authenticated and tries to access auth routes, redirect to dashboard
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
