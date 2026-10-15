
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import { updateArticleFromObject, deleteArticle, getArticleById } from "@/actions/articles-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const item = await getArticleById(id);
  if (!item) return NextResponse.json({ success: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true, item });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const payload = await req.json();
  const sanitized = sanitizePayload(payload);
  const res = await updateArticleFromObject(id, sanitized);
  return NextResponse.json(res);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const res = await deleteArticle(id);
  return NextResponse.json(res);
}
