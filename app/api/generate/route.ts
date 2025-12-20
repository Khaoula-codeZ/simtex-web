import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const API_BASE = process.env.SIMTEX_API_URL || "http://127.0.0.1:8010";

  let r: Response;
  try {
    r = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: `Backend unreachable: ${e?.message || String(e)}`,
      hint: "Check SIMTEX_API_URL on Vercel and Railway service status.",
    });
  }

  const data = await r.json().catch(() => ({ error: "Bad JSON from backend" }));

  // Normalize response so the UI never crashes on missing fields
  const ok = r.ok && !data?.error;

  // If Geant4 is generate-only on cloud, make that explicit
  const cloudNote =
    body?.engine === "geant4"
      ? "Cloud mode: Geant4 runs are not executed on the server. Files are generated for local execution."
      : undefined;

  return NextResponse.json({
    ok,
    ...data,
    note: data?.note || cloudNote,
    status: r.status,
  });
}

