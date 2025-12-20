import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";          // IMPORTANT
export const dynamic = "force-dynamic";   // IMPORTANT

export async function POST(req: NextRequest) {
  const body = await req.json();

  const API_BASE = process.env.SIMTEX_API_URL || "http://127.0.0.1:8010";

  // TEMP DEBUG: return what Vercel sees
  if (body?.__debug === true) {
    return NextResponse.json(
      {
        seen_api_base: API_BASE,
        has_env: !!process.env.SIMTEX_API_URL,
      },
      { status: 200 }
    );
  }

  const r = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({ error: "Bad JSON from backend" }));
  return NextResponse.json(data, { status: r.ok ? 200 : 500 });
}
