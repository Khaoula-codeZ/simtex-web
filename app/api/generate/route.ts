import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const API_BASE = process.env.SIMTEX_API_URL; // do NOT fallback to localhost in production

  if (!API_BASE) {
    return NextResponse.json(
      { error: "SIMTEX_API_URL is not set in Vercel environment variables" },
      { status: 200 }
    );
  }

  try {
    const r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: "Bad JSON from backend", raw };
    }

    // Always return 200 so the UI shows the backend error instead of a generic 500.
    return NextResponse.json(
      { upstream_status: r.status, ...data },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Fetch to SIMTEX_API_URL failed from Vercel",
        api_base: API_BASE,
        detail: String(e?.message || e),
      },
      { status: 200 }
    );
  }
}

