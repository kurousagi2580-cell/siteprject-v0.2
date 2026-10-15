// lib/supabase/queries/index.ts
import "server-only";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/auth/require-admin";
import { parseAdminPayload } from "@/lib/validation/admin-payload";

export async function createEntityWithPage(entityType: string, payload: Record<string, any>) {
  await getAdminUser();
  const tableByType: Record<string, string> = {
    country: "countries",
    character: "characters",
    region: "regions",
    affiliation: "affiliation",
  };
  const table = tableByType[entityType];
  if (!table) throw new Error(`Unsupported entity type: ${entityType}`);
  const validatedPayload = parseAdminPayload(table, payload, "create");
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("create_entity_with_page_generic", {
    p_entity_type: entityType,
    p_payload: validatedPayload,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  return data;
}

export async function deleteEntityWithPage(entityType: string, entityId: string) {
  await getAdminUser();
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc("delete_entity_with_page_generic", {
    p_entity_type: entityType,
    p_entity_id: entityId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  return data;
}
