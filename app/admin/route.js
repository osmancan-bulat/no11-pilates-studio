const ORIGIN = "https://no11-pilates-studio-ro9kcm7fd-osmancanbulat197-7442s-projects.vercel.app";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const incoming = new URL(request.url);
  const target = new URL(`/admin${incoming.search}`, ORIGIN);
  const headers = new Headers(request.headers);
  headers.set("host", target.host);
  headers.delete("content-length");

  const upstream = await fetch(target, { headers, redirect: "manual", cache: "no-store" });
  const responseHeaders = new Headers(upstream.headers);
  ["content-encoding", "content-length", "transfer-encoding", "connection"].forEach((h) => responseHeaders.delete(h));

  if (!(upstream.headers.get("content-type") || "").includes("text/html")) {
    return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
  }

  let html = await upstream.text();
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(
    "</head>",
    `<style id="n11-admin-boot">body>*{visibility:hidden!important}body:before{content:'No.11';visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#f7f6f8;color:#2b212e;font:52px Georgia,serif;letter-spacing:-.04em}</style><link rel="stylesheet" href="${incoming.origin}/no11-admin-premium.css?v=20260914-team-edit-4"><link rel="stylesheet" href="${incoming.origin}/no11-admin-calendar-fix.css?v=20260914-team-edit-4"><script src="${incoming.origin}/no11-admin-firebase.js?v=20260914-team-edit-4" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=20260914-team-edit-4" defer></script></head>`,
  );
  responseHeaders.set("cache-control", "no-store, no-cache, must-revalidate");
  return new Response(html, { status: upstream.status, headers: responseHeaders });
}
