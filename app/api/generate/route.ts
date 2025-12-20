import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const API_BASE = process.env.SIMTEX_API_URL || "http://127.0.0.1:8010";
  const r = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // ✅ forward EVERYTHING (slice_z, slice_axis, autoscale, etc.)
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({ error: "Bad JSON from backend" }));
  return NextResponse.json(data, { status: r.ok ? 200 : 500 });
}
