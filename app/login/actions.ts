"use server";

import { redirect } from "next/navigation";
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";

// ログインは入口そのものなので、この Server Action だけは認証なしで公開されている。
export async function login(formData: FormData) {
  const supabase = await createSupabaseSessionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  const rawNext = String(formData.get("next") ?? "/admin");
  // 外部サイトへのリダイレクトを防ぐ（/admin 配下のみ許可）
  const next = rawNext.startsWith("/admin") ? rawNext : "/admin";

  if (error) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function logout() {
  const supabase = await createSupabaseSessionClient();
  await supabase.auth.signOut();
  redirect("/login");
}
