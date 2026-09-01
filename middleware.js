import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/no11-admin-detail.js") {
    url.pathname = "/no11-admin-loader.js";
    return NextResponse.rewrite(url);
  }
  if (url.pathname.startsWith("/_next/static/")) {
    url.pathname = `/__old1${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/_next/static/:path*", "/no11-admin-detail.js"],
};
