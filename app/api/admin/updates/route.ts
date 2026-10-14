// app/api/admin/affiliations/route.ts  (POST)
import "server-only";
import { NextResponse } from "next/server";
import {
  createUpdateFromObject,
} from "@/actions/updates-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function POST(req: Request) {
  //await requireAdmin();
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["number"]);
  const res = await createUpdateFromObject(sanitized);
  return NextResponse.json(res, res.success ? { status: 200 } : { status: 400 });
}


