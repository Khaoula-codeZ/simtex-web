import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important: we stream binary (zip)

export async function GET(req: Request) {
  const url = new URL(req.url);
  const engine = (url.searchParams.get("engine") || "").toLowerCase();
  const caseId = url.searchParams.get("case_id") || "";

  if (!engine || !caseId) {
    return NextResponse.json(
      { error: "Missing engine or case_id" },
      { status: 400 }
    );
  }

  const base = process.env.SIMTEX_API_URL;
  if (!base) {
    return NextResponse.json(
      { error: "SIMTEX_API_URL is not set" },
      { status: 500 }
    );
  }

  // Currently we only need geant4 zip download
  if (engine !== "geant4") {
    return NextResponse.json(
      { error: "Unsupported engine for file download (use geant4)" },
      { status: 400 }
    );
  }

  const upstream = `${base.replace(/\/$/, "")}/download/geant4/${caseId}`;

  const r = await fetch(upstream, { method: "GET" });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return NextResponse.json(
      { error: `Upstream failed: ${r.status}`, detail: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const buf = Buffer.from(await r.arrayBuffer());

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="geant4_${caseId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
