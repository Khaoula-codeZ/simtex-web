import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PROD_FALLBACK = "https://web-production-63a8a.up.railway.app";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // ✅ Always use Railway on Vercel if env is missing
  const API_BASE =
    process.env.SIMTEX_API_URL ||
    (process.env.VERCEL ? PROD_FALLBACK : "http://127.0.0.1:8010");

  // ✅ Debug without crashing
  if (body?.__debug === true) {
    return NextResponse.json({
      seen_api_base: API_BASE,
      has_env: !!process.env.SIMTEX_API_URL,
      is_vercel: !!process.env.VERCEL,
    });
  }

  try {
    const r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { error: text || "Non-JSON from backend" }; }

    return NextResponse.json(data, { status: r.ok ? 200 : 500 });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Fetch failed`, detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
