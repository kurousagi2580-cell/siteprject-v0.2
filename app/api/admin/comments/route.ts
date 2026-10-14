// app/api/comments/route.ts
import "server-only";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { NextResponse } from "next/server";
import { createCommentFromObject } from "@/actions/comments-actions-server"; // createCommentFromObject を置いたファイルパスに合わせてください
import { isRateLimited } from "@/lib/comments/rate-limit";

const BodySchema = z.object({
  page_id: z.string().min(1),
  content: z.string().min(1).max(2000),
  user_name: z.string().min(1).max(100).optional().default("名無し"),
  parent_id: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

    // レート制限（非同期対応）
    if (await isRateLimited(`comments:${ip}`)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const payload = await req.json();
    const parsed = BodySchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_payload", details: parsed.error.format() }, { status: 400 });
    }

    const { page_id, content, user_name, parent_id } = parsed.data;

    // サニタイズ（コメントはプレーンテキスト扱い）
    const cleanContent = sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanName = sanitizeHtml(user_name ?? "名無し", { allowedTags: [], allowedAttributes: {} }).trim() || "名無し";

    // サーバー側のアクションを呼ぶ
    const res = await createCommentFromObject({
      page_id,
      user_name: cleanName,
      content: cleanContent,
      parent_id: parent_id ?? null,
      ip,
    });

    if (!res || !res.success) {
      return NextResponse.json({ error: res?.error ?? "failed_to_create" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: res.id, item: res.item });
  } catch (err: any) {
    console.error("API comments POST error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
