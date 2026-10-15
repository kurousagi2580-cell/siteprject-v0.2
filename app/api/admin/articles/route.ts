
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import { createArticleFromObject } from "@/actions/articles-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids"

export async function POST(req: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  const payload = await req.json();
    const sanitized = sanitizePayload(payload);
    const res = await createArticleFromObject(sanitized);
    if (!res.success) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
}

