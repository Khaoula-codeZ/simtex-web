import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (e: any) {
      return NextResponse.json(
        { error: "Failed to parse JSON body in Vercel route", detail: String(e?.message || e) },
        { status: 200 }
      );
    }

    const API_BASE = process.env.SIMTEX_API_URL;
    if (!API_BASE) {
      return NextResponse.json(
        { error: "SIMTEX_API_URL is not set in Vercel env vars" },
        { status: 200 }
      );
    }

    const r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = { error: "Bad JSON from backend", raw }; }

    return NextResponse.json({ upstream_status: r.status, ...data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Vercel /api/generate crashed", detail: String(e?.message || e) },
      { status: 200 }
    );
  }
}
