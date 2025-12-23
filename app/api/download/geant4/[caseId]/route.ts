// app/api/download/geant4/[caseId]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: any, context: any) {
  const caseId = context?.params?.caseId;

  if (!caseId) {
    return NextResponse.json({ error: "Missing caseId param." }, { status: 400 });
  }

  const base = process.env.SIMTEX_API_URL;
  if (!base) {
    return NextResponse.json(
      { error: "SIMTEX_API_URL is not set (Vercel env vars)." },
      { status: 500 }
    );
  }

  const url = `${String(base).replace(/\/$/, "")}/download/geant4/${encodeURIComponent(caseId)}`;

  const upstream = await fetch(url, { method: "GET" });

  if (!upstream.ok) {
    const msg = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: `Backend download failed (${upstream.status}).`, detail: msg.slice(0, 500) },
      { status: 502 }
    );
  }

  const headers = new Headers();
  headers.set("content-type", upstream.headers.get("content-type") || "application/zip");

  const cd = upstream.headers.get("content-disposition");
  headers.set("content-disposition", cd || `attachment; filename="geant4_${caseId}.zip"`);

  headers.set("cache-control", "no-store");

  return new Response(upstream.body, { status: 200, headers });
}
