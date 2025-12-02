import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protected routes that require authentication
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/api/vote");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
