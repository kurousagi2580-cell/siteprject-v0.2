// app/api/admin/affiliations/route.ts  (POST)
import "server-only";
import { NextResponse } from "next/server";
import {
  createPageFromObject,
} from "@/actions/pages-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function POST(req: Request) {
  //await requireAdmin();
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["number"]);
  const res = await createPageFromObject(sanitized);
  return NextResponse.json(res, res.success ? { status: 200 } : { status: 400 });
}


