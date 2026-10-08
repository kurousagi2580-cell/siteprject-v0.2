import { fetchData } from "@/lib/supabase/queries"
import type { UpdateLog } from "@/types/updatelog"

export async function getUpdateLogs(type: string = "") {
  const filters =
    type === ""
      ? [] // ← type が空ならフィルターなし
      : [{ column: "type", operator: "eq" as const, value: type }]

  return await fetchData<UpdateLog>("updateslog", {
    select: `
      id,
      type,
      target_id,
      action,
      description,
      created_at
    `,
    filters,
    order: [{ column: "created_at", ascending: false }],
  })
}

