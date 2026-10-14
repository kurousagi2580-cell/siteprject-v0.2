
import "server-only";
import { NextResponse } from "next/server";
import { updateLocationFromObject, deleteLocation, getLocationById } from "@/actions/locations-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"
//import { requireAdmin } from "@/auth/require-admin";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const item = await getLocationById(id);
  if (!item) return NextResponse.json({ success: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true, item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  //wait requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const payload = await req.json();
  const sanitized = sanitizePayload(payload, ["x", "y"]);
  const res = await updateLocationFromObject(id, sanitized);
  return NextResponse.json(res);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const res = await deleteLocation(id);
  return NextResponse.json(res);
}
