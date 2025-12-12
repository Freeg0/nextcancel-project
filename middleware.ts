import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, we'll handle auth checks in the layout components
  // Next Auth v5 middleware works differently
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
