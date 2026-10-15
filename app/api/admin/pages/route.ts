// app/api/admin/affiliations/route.ts  (POST)
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import {
  createPageFromObject,
} from "@/actions/pages-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"

export async function POST(req: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["number"]);
  const res = await createPageFromObject(sanitized);
  return NextResponse.json(res, res.success ? { status: 200 } : { status: 400 });
}


