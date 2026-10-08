
import type { CharacterDetaill } from "@/types/character"
import type { MergedRelation } from "@/types/relationships"

export function mergeRelations(character:CharacterDetaill) : MergedRelation[] {
  return [
    ...(character.relationships ?? []).map((r) => ({
      id: r.id,
      relation_type: r.relation_type,
      relation_description: r.relation_description,
      direction: r.direction,
      target: r.target ?? null,
    })),
    ...(character.reverse_relationships ?? []).map((r) => ({
      id: r.id,
      relation_type: r.relation_type,
      relation_description: r.relation_description,
      direction: r.direction,
      target: r.source?? null ,
    })),
  ]
}
