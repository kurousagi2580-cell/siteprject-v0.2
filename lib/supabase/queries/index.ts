// lib/supabase/queries/index.ts
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createEntityWithPage(entityType: string, payload: Record<string, any>) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("create_entity_with_page_generic", {
    p_entity_type: entityType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEntityWithPage(entityType: string, entityId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("delete_entity_with_page_generic", {
    p_entity_type: entityType,
    p_entity_id: entityId,
  });
  if (error) throw new Error(error.message);
  return data;
}
