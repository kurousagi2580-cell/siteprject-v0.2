
import "server-only";
import { NextResponse } from "next/server";
import { createLocationFromObject } from "@/actions/locations-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function POST(req: Request) {
  //await requireAdmin();
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["x", "y"]);
  const res = await createLocationFromObject(sanitized);
  if (!res.success) return NextResponse.json(res, { status: 400 });
  return NextResponse.json(res);
}
