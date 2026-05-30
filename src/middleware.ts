import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get session token using NextAuth helper
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const pathname = request.nextUrl.pathname;

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isBidanRoute = pathname.startsWith("/midwife");
  const isPatientRoute = pathname.startsWith("/patient");
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtected = isAdminRoute || isBidanRoute || isPatientRoute;

  // Redirect to login if no session and accessing protected routes
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to home if has session and accessing auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check role-based access if token exists and accessing protected routes
  if (token && isProtected) {
    const role = token.role;

    if (!role) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Role-based route protection
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (isBidanRoute && role !== "BIDAN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (isPatientRoute && role !== "PASIEN") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
