// app/api/admin/affiliations/route.ts  (POST)
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import { createEntityWithPage } from "@/lib/supabase/queries/index"; // server-only helper
import { sanitizePayload } from "@/lib/utils/sanitize-ids"

export async function POST(req: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;
  try {
      const payload = sanitizePayload(await req.json());
      const result = await createEntityWithPage("affiliation", payload);
      return NextResponse.json({ success: true, result: result });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}


