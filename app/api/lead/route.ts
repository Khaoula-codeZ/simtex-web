import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  // Vercel/serverless filesystem is read-only → don't write leads.json here.
  // For now we just accept and unlock.
  return NextResponse.json({ ok: true });
}
