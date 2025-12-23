export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = {
  params: Promise<{ caseId: string }>;
};

export async function GET(_req: Request, ctx: Ctx) {
  const { caseId } = await ctx.params;

  if (!caseId) {
    return Response.json({ error: "Missing caseId param." }, { status: 400 });
  }

  const base = process.env.SIMTEX_API_URL;
  if (!base) {
    return Response.json(
      { error: "SIMTEX_API_URL is not set (Vercel env vars)." },
      { status: 500 }
    );
  }

  const url =
    `${base.replace(/\/$/, "")}` +
    `/download/geant4/${encodeURIComponent(caseId)}`;

  const upstream = await fetch(url);

  if (!upstream.ok) {
    const msg = await upstream.text().catch(() => "");
    return Response.json(
      {
        error: `Backend download failed (${upstream.status}).`,
        detail: msg.slice(0, 500),
      },
      { status: 502 }
    );
  }

  const headers = new Headers();
  headers.set(
    "content-type",
    upstream.headers.get("content-type") || "application/zip"
  );
  headers.set(
    "content-disposition",
    upstream.headers.get("content-disposition") ||
      `attachment; filename="geant4_${caseId}.zip"`
  );
  headers.set("cache-control", "no-store");

  return new Response(upstream.body, { status: 200, headers });
}
