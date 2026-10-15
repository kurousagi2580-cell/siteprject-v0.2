// lib/supabase/ssr.ts
// ログイン中ユーザーのセッション（Cookie）を扱う Supabase クライアント。
// service role ではなく anon キー + ユーザーのセッションで動く。
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseSessionClient() {
  const store = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          // Server Component からは Cookie を書き込めないので握りつぶす
          // （トークン更新は proxy.ts 側で行う）
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}
