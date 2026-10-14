import { createClient, SupabaseClient } from "@supabase/supabase-js"

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_ANON_KEY = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

export function createSupabaseServerClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
