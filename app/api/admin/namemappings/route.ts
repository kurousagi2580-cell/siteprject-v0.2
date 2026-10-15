// src/app/api/articles/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth/require-admin";
import { createNameMappingsFromObject } from "@/actions/namemaps-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids";
import { clearNameMapCache } from "@/lib/supabase/queries/name-maps";

export async function POST(req: Request) {
  const denied = await guardAdmin();
  if (denied) return denied;

  try {
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);
    const res = await createNameMappingsFromObject(sanitized);

    if (!res || res.success === false) {
      const status = (res && res.error === "slug_conflict") ? 409 : 400;
      return NextResponse.json(res, { status });
    }

    // 成功時は 201 を返す（作成）
    clearNameMapCache()
    return NextResponse.json(res, { status: 201 });
  } catch (err: any) {
    // サーバー側で throw された slug_conflict を直接受け取るケース
    if (err?.message === "slug_conflict") {
      return NextResponse.json(
        { success: false, error: "slug_conflict", message: "そのスラッグは既に使われています。" },
        { status: 409 }
      );
    }

    // JSON parse エラーやバリデーションエラーなど
    if (err instanceof SyntaxError) {
      return NextResponse.json({ success: false, error: "invalid_json", message: err.message }, { status: 400 });
    }

    // それ以外は 500
    console.error("articles POST error:", err);
    return NextResponse.json({ success: false, error: "server_error", detail: String(err?.message ?? err) }, { status: 500 });
  }
}