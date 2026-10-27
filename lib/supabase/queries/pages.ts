import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Page } from "@/types/page"

export async function getPageByResource(resourceType: string, resourceId: string): Promise<Page | null> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("resource_type", resourceType)
    .eq("resource_id", resourceId)
    .limit(1)
    .returns<Page[]>()

  if (error) {
    console.error("getPageByResource error:", error)
    throw error
  }

  return data?.[0] ?? null
}
