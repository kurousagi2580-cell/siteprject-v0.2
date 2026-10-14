
import "server-only";
import { NextResponse } from "next/server";
import { createEntityWithPage } from "@/lib/supabase/queries/index"; // server-only helper
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function POST(req: Request) {
  try {
      //await requireAdmin();
      const payload = sanitizePayload(await req.json());
      const result = await createEntityWithPage("country", payload);
      return NextResponse.json({ success: true, result: result });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
}
