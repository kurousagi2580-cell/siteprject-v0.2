// lib/auth/require-admin.ts（人称実装前の最小構成）
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function parseCookies(cookieHeader: string | null) {
  const out: Record<string,string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const [k, ...v] = part.split("=");
    if (!k) continue;
    out[k.trim()] = decodeURIComponent((v || []).join("=").trim());
  }
  return out;
}

async function getToken() {
  const h = await headers();
  const auth = h.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice("Bearer ".length);

  const cookieHeader = h.get("cookie");
  const cookies = parseCookies(cookieHeader);

  const candidates = [
    "sb-access-token",
    "sb:token",
    "supabase-auth-token",
    "supabase-session",
  ];

  for (const name of candidates) {
    const raw = cookies[name];
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.access_token ?? parsed?.accessToken ?? raw;
    } catch {
      return raw;
    }
  }

  return null;
}

export async function requireAdmin() {
  const token = getToken();
  if (!token) {
    const e: any = new Error("unauthenticated");
    e.status = 401;
    throw e;
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) {
    const e: any = new Error("unauthenticated");
    e.status = 401;
    throw e;
  }

  const user = data.user;
  if (!user.user_metadata?.is_admin) {
    const e: any = new Error("forbidden");
    e.status = 403;
    throw e;
  }

  // 返却しない（人称実装前の状態）
  return;
}
