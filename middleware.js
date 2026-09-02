import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/no11-admin-detail.js") {
    return new NextResponse(
      "(function(){var s=document.createElement('link');s.rel='stylesheet';s.href='/no11-admin-exact-20.css';s.dataset.no11Premium='1';document.head.appendChild(s);var j=document.createElement('script');j.src='/no11-admin-exact-20.js';j.defer=true;document.head.appendChild(j);})();",
      { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store, max-age=0" } }
    );
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
