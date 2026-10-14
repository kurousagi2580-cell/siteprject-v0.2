
import "server-only";
import { NextResponse } from "next/server";
import { createEventFromObject } from "@/actions/events-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function POST(req: Request) {
  //await requireAdmin();
  const payload = await req.json();
  console.log(payload)
  const sanitized = sanitizePayload(payload);
  console.log(sanitized)
  const res = await createEventFromObject(sanitized);
  if (!res.success) return NextResponse.json(res, { status: 400 });
  return NextResponse.json(res);
  
}
