import type { CharacterDetaill } from "@/types/character"
import { fetchData } from "@/lib/supabase/queries"

export async function getCharacterDetail(slug: string) {
    return await fetchData<CharacterDetaill>("characters", {
        select: `
        id,
        name,
        short_name,
        type,
        image_url,
        profile,
        affiliation:affiliation_id (
          id,
          name,
          icon_url,
          description,
          category,
          order,
          parent_affiliation_id
        ),
        relationships:relationships!relationships_character_id_fkey (
        id,
        character_id,
        target_character_id,
        relation_type,
        relation_description,
        direction,
        target:target_character_id (
          id,
          slug,
          name,
          image_url
        )
      ),
      reverse_relationships:relationships!relationships_target_character_id_fkey (
        id,
        character_id,
        target_character_id,
        relation_type,
        relation_description,
        direction,
        source:character_id (
          id,
          slug,
          name,
          image_url
        )
      )
        `,
        filters: [
        { column: "slug", operator: "eq", value: slug }
      ],
      single: true
    })
}
