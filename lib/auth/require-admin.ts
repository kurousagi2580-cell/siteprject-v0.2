// lib/auth/require-admin.ts
// 管理者認証の中核。管理操作はすべてここを通す。
import "server-only";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";

export class AuthError extends Error {
  constructor(public status: 401 | 403) {
    super(status === 401 ? "unauthenticated" : "forbidden");
  }
}

/**
 * ログイン中の管理者を返す。未ログインなら 401、管理者でなければ 403 の AuthError を投げる。
 * - JWT は getClaims() で検証し、通常の権限確認で Auth サーバーを呼び出さない
 * - 権限は app_metadata.role で判定する。
 *   user_metadata はユーザー本人が書き換えられるので、権限判定には絶対に使わない。
 */
export async function getAdminUser() {
  const supabase = await createSupabaseSessionClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims || typeof claims.sub !== "string") throw new AuthError(401);
  if (claims.app_metadata?.role !== "admin") throw new AuthError(403);
  return claims;
}

/** API ルート用。呼び出し側は `const denied = await guardAdmin(); if (denied) return denied;` と書く。 */
export async function guardAdmin(): Promise<NextResponse | null> {
  try {
    await getAdminUser();
    return null;
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ success: false, error: e.message }, { status: e.status });
    }
    throw e;
  }
}

/** 管理ページ（Server Component）用。未ログイン／非管理者は /login へリダイレクトする。 */
export async function requireAdminPage(next = "/admin") {
  try {
    return await getAdminUser();
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(`/login?next=${encodeURIComponent(next)}`);
    }
    throw e;
  }
}
