// app/api/download/geant4/[caseId]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important: we stream bytes
export const dynamic = "force-dynamic"; // avoid caching weirdness

type Ctx = { params: { caseId: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const caseId = params.caseId;

  const base = process.env.SIMTEX_API_URL;
  if (!base) {
    return NextResponse.json(
      { error: "SIMTEX_API_URL is not set (Vercel env vars)." },
      { status: 500 }
    );
  }

  // This should point to your BACKEND (Railway) endpoint that returns the ZIP.
  // Example backend route: GET /download/geant4/:caseId
  const url = `${base.replace(/\/$/, "")}/download/geant4/${encodeURIComponent(caseId)}`;

  const upstream = await fetch(url, {
    method: "GET",
    // If your Railway endpoint requires auth, add it here.
    // headers: { Authorization: `Bearer ${process.env.SIMTEX_API_KEY}` },
  });

  if (!upstream.ok) {
    const msg = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `Backend download failed (${upstream.status}).`, detail: msg.slice(0, 500) },
      { status: 502 }
    );
  }

  // Pass through content type + disposition, but force a filename if missing
  const headers = new Headers();
  const ct = upstream.headers.get("content-type") || "application/zip";
  headers.set("content-type", ct);

  const cd = upstream.headers.get("content-disposition");
  headers.set(
    "content-disposition",
    cd || `attachment; filename="geant4_${caseId}.zip"`
  );

  // Optional: avoid caching
  headers.set("cache-control", "no-store");

  return new Response(upstream.body, { status: 200, headers });
}
