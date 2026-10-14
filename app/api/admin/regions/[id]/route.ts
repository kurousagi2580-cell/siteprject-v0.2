
import "server-only";
import { NextResponse } from "next/server";
import { updateRegionFromObject, getRegionById } from "@/actions/regions-actions-server";
import { deleteEntityWithPage } from "@/lib/supabase/queries/index"; // server-only helper
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const item = await getRegionById(id);
  if (!item) return NextResponse.json({ success: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true, item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  //wait requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["map_x", "map_y"]);
  const res = await updateRegionFromObject(id, sanitized);
  return NextResponse.json(res);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  try {
    const result = await deleteEntityWithPage("region", id);
    return NextResponse.json({ success: true, result: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
