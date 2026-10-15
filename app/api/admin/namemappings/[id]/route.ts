// src/app/api/articles/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import {  updateNameMappingsFromObject, deleteNameMappings, getNameMappingsById } from "@/actions/namemaps-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids";
import { clearNameMapCache } from "@/lib/supabase/queries/name-maps";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const item = await getNameMappingsById(id);
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
  const res = await updateNameMappingsFromObject(id, sanitized);
  clearNameMapCache()
  return NextResponse.json(res);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const res = await deleteNameMappings(id);
  clearNameMapCache()
  return NextResponse.json(res);
}