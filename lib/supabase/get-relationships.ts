import { fetchData } from "@/lib/supabase/queries"


export async function getRelationships() {
    const data = await fetchData("relationships", {
    select: `
        id,
        relation_type,
        relation_description,
        direction,
        updated_at,
        character:characters!relationships_character_id_fkey ( id, name ),
        target:characters!relationships_target_character_id_fkey ( id, name )
        `,
    order: [{ column: "updated_at", ascending: false }],
  })

  // summary を生成して返す
  const relations = data.map((r: any) => {
    const arrow = r.direction === "two-way" ? "↔" : "→"

    return {
      ...r,
      character_name: r.character?.name ?? "",
      target_character_name: r.target?.name ?? "",
      relation_summary: `${r.relation_type}（${r.character?.name} ${arrow} ${r.target?.name}）`,
    }
  })

  return relations
}