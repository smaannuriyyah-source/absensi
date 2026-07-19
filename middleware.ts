import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no auth needed
  if (pathname === "/login" || pathname === "/" || pathname === "/api/auth/login") {
    const response = NextResponse.next();
    try {
      const session = await getIronSession<SessionData>(request, response, sessionOptions);
      if (session.id) {
        return NextResponse.redirect(
          new URL(session.role === "admin" ? "/admin" : "/teacher", request.url)
        );
      }
    } catch {}
    return response;
  }

  // Protected routes
  const response = NextResponse.next();
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    if (!session.id) {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/login", request.url));
    }

    // Role check
    if (pathname.startsWith("/admin") && session.role !== "admin") {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/teacher", request.url));
    }
    if (pathname.startsWith("/teacher") && session.role !== "teacher") {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/admin", request.url));
    }
  } catch {
    return pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
