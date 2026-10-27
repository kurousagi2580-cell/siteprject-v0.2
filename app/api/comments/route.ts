// app/api/comments/route.ts
import "server-only";
import { isIP } from "node:net";
import { ipAddress } from "@vercel/functions";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { NextResponse } from "next/server";
import { createCommentFromObject } from "@/actions/comments-actions-server"; // createCommentFromObject を置いたファイルパスに合わせてください
import { hashClientIp, isRateLimited, RateLimitUnavailableError } from "@/lib/comments/rate-limit";

const BodySchema = z.object({
  page_id: z.string().min(1),
  content: z.string().min(1).max(2000),
  user_name: z.string().min(1).max(100).optional().default("名無し"),
  parent_id: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  const forwardedIp = ipAddress(req);
  const ip = forwardedIp && isIP(forwardedIp)
    ? forwardedIp
    : process.env.NODE_ENV === "development"
      ? "127.0.0.1"
      : null;

  if (!ip) {
    return NextResponse.json({ error: "client_ip_unavailable" }, { status: 503 });
  }

  try {
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
  } catch (err) {
    console.error("Comment rate limiter unavailable", err);
    return NextResponse.json(
      { error: err instanceof RateLimitUnavailableError ? "rate_limit_not_configured" : "rate_limit_unavailable" },
      { status: 503 },
    );
  }

  try {
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
      ip: hashClientIp(ip),
    });

    if (!res || !res.success) {
      return NextResponse.json({ error: res?.error ?? "failed_to_create" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: res.id, item: res.item });
  } catch (err: any) {
    const errorCode = err?.code ?? err?.cause?.code ?? err?.original?.code;

    if (errorCode === "23505" || err?.message === "comment_conflict") {
      return NextResponse.json({ error: "comment_conflict" }, { status: 503 });
    }

    console.error("API comments POST error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
