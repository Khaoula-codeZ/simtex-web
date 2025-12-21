import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const API_BASE = process.env.SIMTEX_API_URL;

  // On Vercel, NEVER fall back to localhost.
  if (!API_BASE) {
    return NextResponse.json(
      {
        error:
          "SIMTEX_API_URL is not set in Vercel Environment Variables (Project Settings).",
      },
      { status: 500 }
    );
  }

  // Require https:// so we don't accidentally set a broken value.
  if (!/^https?:\/\//.test(API_BASE)) {
    return NextResponse.json(
      {
        error:
          "SIMTEX_API_URL must start with https:// (example: https://web-production-63a8a.up.railway.app)",
        got: API_BASE,
      },
      { status: 500 }
    );
  }

  let r: Response;
  try {
    r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Fetch to SimTex backend failed", detail: String(e?.message || e) },
      { status: 500 }
    );
  }

  const text = await r.text();
  // Always return JSON, even if backend returns plain text
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  return NextResponse.json(data, { status: r.ok ? 200 : 500 });
}
