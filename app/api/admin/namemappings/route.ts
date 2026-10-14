// src/app/api/articles/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { createNameMappingsFromObject, updateNameMappingsFromObject, deleteNameMappings, getNameMappingsById } from "@/actions/namemaps-actions-server";
import { sanitizePayload } from "@/lib/utils/sanitize-ids";
import { clearNameMapCache } from "@/lib/supabase/queries/name-maps";
// import { requireAdmin } from "@/auth/require-admin"; // 必要なら有効化

export async function POST(req: Request) {
  // 管理者チェックを入れる場合（コメント解除して実装）
  // const admin = await requireAdmin(req);
  // if (!admin) return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });

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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const item = await getNameMappingsById(id);
  if (!item) return NextResponse.json({ success: false, error: "not found" }, { status: 404 });
  return NextResponse.json({ success: true, item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  //wait requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const payload = await req.json();
  const sanitized = sanitizePayload(payload);
  const res = await updateNameMappingsFromObject(id, sanitized);
  clearNameMapCache()
  return NextResponse.json(res);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  //await requireAdmin();
  const { id } = await params;
  if (!id) return NextResponse.json({ success: false, error: "missing id" }, { status: 400 });
  const res = await deleteNameMappings(id);
  clearNameMapCache()
  return NextResponse.json(res);
}