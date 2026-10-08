import type { Affiliation } from "./affiliation"
import type { RelationshipJoinCharacter } from "./relationships"

export type CharacterDetaill = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  type: string | null
  profile: {
    age: number | null,
    height: number | null,
    birthday: string | null,
    favorites: string[] | null,
    voice_actor: string | null
  } | null
  description: string | null
  spaction: string | null
  slug: string | null
  affiliation?: Affiliation | null
  relationships?: RelationshipJoinCharacter[] | null
  reverse_relationships?: RelationshipJoinCharacter[] | null
}

export type Character = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  type: string | null
  profile: {
    age: number | null,
    height: number | null,
    birthday: string | null,
    favorites: string[] | null,
    voice_actor: string | null
  } | null
  description: string | null
  spaction: string | null
  affiliation_id: string | null
  slug: string | null
}
