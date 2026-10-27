import type { Affiliation } from "./affiliation"
import type { RelationshipJoinCharacter } from "./relationships"

export type CharacterProfile = {
  age: number | null
  height: number | null
  birthday: string | null
  favorites: string[] | null
  voice_actor: string | null
}

export type CharacterDetaill = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  type: string | null
  profile: CharacterProfile | null
  description: string | null
  epithet: string | null
  release_version: string | null
  release_date: string | null
  spaction: string | null
  slug: string | null
  updated_at: string | null
  affiliation?: Affiliation | null
  relationships?: RelationshipJoinCharacter[] | null
  reverse_relationships?: RelationshipJoinCharacter[] | null
}

export type CharacterJoinAffiliation = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  type: string | null
  spaction: string | null
  profile: CharacterProfile | null
  description: string | null
  epithet: string | null
  release_version: string | null
  release_date: string | null
  affiliation?: Affiliation | null
  slug: string | null
  updated_at: string | null
}

export type Character = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  type: string | null
  profile: CharacterProfile | null
  description: string | null
  epithet: string | null
  release_version: string | null
  release_date: string | null
  spaction: string | null
  affiliation_id: string | null
  slug: string | null
  created_at: string | null
  updated_at: string | null
}
