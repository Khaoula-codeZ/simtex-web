import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  // This MUST be set in Vercel env for Production (and Preview if you use preview deploys)
  const base = process.env.SIMTEX_API_URL;
  if (!base) return null;
  return base.replace(/\/+$/, "");
}

export async function GET(
  _req: Request,
  { params }: { params: { caseId: string } }
) {
  const base = getBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "SIMTEX_API_URL is not set on Vercel." },
      { status: 500 }
    );
  }

  const caseId = params.caseId;
  const upstream = `${base}/download/geant4/${encodeURIComponent(caseId)}`;

  const r = await fetch(upstream, {
    method: "GET",
    // don’t cache zip downloads on Vercel
    cache: "no-store",
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    return NextResponse.json(
      { error: "Upstream ZIP fetch failed", status: r.status, body: txt.slice(0, 400) },
      { status: 502 }
    );
  }

  const body = r.body;
  if (!body) {
    return NextResponse.json({ error: "Upstream response has no body." }, { status: 502 });
  }

  // Stream ZIP back to browser
  return new NextResponse(body as any, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="geant4_${caseId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
