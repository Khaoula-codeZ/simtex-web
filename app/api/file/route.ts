import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("path");
  if (!p) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  // Only allow serving files from ParserWriter/out
  const allowedRoot = path.resolve("/Users/khaoula/Downloads/ParserWriter/out") + path.sep;
  const real = path.resolve(p);

  if (!real.startsWith(allowedRoot)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  if (!fs.existsSync(real)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buf = fs.readFileSync(real);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
