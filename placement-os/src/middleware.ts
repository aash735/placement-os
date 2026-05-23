import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware — Simplified pass-through.
 *
 * Route protection is handled client-side in AuthProvider (localStorage session check).
 * We do NOT use Supabase Auth cookies or server-side session validation here,
 * because the custom auth system is localStorage-based (client-only).
 *
 * This middleware just passes all requests through unchanged.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and Next.js internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
