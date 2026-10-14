// lib/comments/insert-comment.ts
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function insertComment({
  pageId,
  parentId,
  userName,
  content,
}: {
  pageId: string;
  parentId: string | null;
  userName: string;
  content: string;
}) {
  const supabase = createSupabaseAdminClient();

  // number を自動採番する簡易例（トランザクションが必要な場合は DB 側で対応）
  const { data: last, error: lastErr } = await supabase
    .from("comments")
    .select("number")
    .eq("page_id", pageId)
    .order("number", { ascending: false })
    .limit(1)
    .single();

  if (lastErr && lastErr.code !== "PGRST116") {
    console.error("insertComment last number fetch error", lastErr);
    throw lastErr;
  }

  const nextNumber = last?.number ? last.number + 1 : 1;

  const { error } = await supabase.from("comments").insert({
    page_id: pageId,
    parent_id: parentId,
    number: nextNumber,
    user_name: userName,
    content,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("insertComment error", error);
    throw error;
  }
}
