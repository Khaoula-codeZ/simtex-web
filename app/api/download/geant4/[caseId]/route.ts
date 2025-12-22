import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important: allow streaming/buffers

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await ctx.params;

  const base = process.env.SIMTEX_API_URL;
  if (!base) {
    return NextResponse.json({ error: "SIMTEX_API_URL is not set" }, { status: 500 });
  }

  const upstream = `${base.replace(/\/+$/, "")}/download/geant4/${encodeURIComponent(caseId)}`;

  const r = await fetch(upstream, { method: "GET" });

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    return NextResponse.json(
      { error: `Upstream download failed (${r.status})`, details: txt.slice(0, 500) },
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
