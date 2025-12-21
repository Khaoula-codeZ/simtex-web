import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getApiBase() {
  const v = process.env.SIMTEX_API_URL?.trim();

  // On Vercel, NEVER fall back to localhost (it will always fail).
  if (!v) {
    throw new Error(
      "SIMTEX_API_URL is missing in Vercel Environment Variables. Set it in Project Settings → Environment Variables, then redeploy."
    );
  }

  return v.replace(/\/+$/, ""); // strip trailing slash
}

export async function GET() {
  // health + env visibility
  return NextResponse.json({
    ok: true,
    has_SIMTEX_API_URL: !!process.env.SIMTEX_API_URL,
    SIMTEX_API_URL_preview: (process.env.SIMTEX_API_URL || "").slice(0, 60),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const API_BASE = getApiBase();

    const r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // optional: prevent caching weirdness
      cache: "no-store",
    });

    const text = await r.text(); // read raw first
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: "Backend returned non-JSON", raw: text };
    }

    return NextResponse.json(data, { status: r.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
