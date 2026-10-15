
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import { createLocationFromObject } from "@/actions/locations-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"

export async function POST(req: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["x", "y"]);
  const res = await createLocationFromObject(sanitized);
  if (!res.success) return NextResponse.json(res, { status: 400 });
  return NextResponse.json(res);
}
