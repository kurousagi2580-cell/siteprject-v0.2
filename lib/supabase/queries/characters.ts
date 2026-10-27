import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { CharacterJoinAffiliation, CharacterDetaill, Character } from "@/types/character"
import type { CharacterSkill } from "@/types/character-skill"
import type { CharacterStatsRow } from "@/types/character-stats"

export async function getCharacterJoinAffiliation(): Promise<CharacterJoinAffiliation[] | null> {
  const supabase = createSupabaseServerClient()

  const select = `
    id,
    name,
    short_name,
    image_url,
    type,
    profile,
    description,
    epithet,
    release_version,
    release_date,
    affiliation:affiliation (
      id,
      name,
      short_name,
      icon_url,
      description,
      category,
      parent_affiliation_id,
      slug,
      created_at,
      updated_at
    ),
    spaction,
    slug,
    updated_at
  `

  const { data, error } = await supabase
    .from("characters")
    .select(select)
    .eq("type", "プレイアブル")
    .returns<CharacterJoinAffiliation[]>()

  if (error) {
    console.error("getCharacterJoinAffiliation error:", error)
    throw error
  }

  return data
}

export async function getCharacterDetail(slug: string): Promise<CharacterDetaill | null> {
  const supabase = createSupabaseServerClient()
  const select = `
    id,
    name,
    short_name,
    type,
    image_url,
    profile,
    description,
    epithet,
    release_version,
    release_date,
    spaction,
    slug,
    updated_at,
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
  `

  const { data, error } = await supabase
    .from("characters")
    .select(select)
    .eq("slug", slug)
    .maybeSingle()
    .returns<CharacterDetaill>()

  if (error) {
    console.error("getCharacterDetail error:", error)
    throw error
  }

  return data
}

export async function getCharacterSkills(characterId: string): Promise<CharacterSkill[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("character_skills")
    .select("*")
    .eq("character_id", characterId)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .returns<CharacterSkill[]>()

  if (error) {
    console.error("getCharacterSkills error:", error)
    throw error
  }

  return data ?? []
}

export async function getCharacterStats(characterId: string): Promise<CharacterStatsRow[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("character_stats")
    .select("*")
    .eq("character_id", characterId)
    .order("level", { ascending: true })
    .returns<CharacterStatsRow[]>()

  if (error) {
    console.error("getCharacterStats error:", error)
    throw error
  }

  return data ?? []
}

