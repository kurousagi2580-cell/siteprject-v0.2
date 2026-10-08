export type RelationshipJoinCharacter = {
  id: string
  character_id: string
  target_character_id: string | null
  relation_type: string | null
  relation_description: string | null
  direction: string | null
  target?: {
    id: string
    slug: string
    name: string
    image_url: string | null
  } | null
  source?: {
    id: string
    slug: string
    name: string
    image_url: string | null
  } | null
}

export type Relationship = {
  id: string
  character_id: string
  target_character_id: string | null
  relation_type: string | null
  direction: string | null
  relation_description: string | null
  updated_at: string | null
}

export type MergedRelation = {
  id: string
  relation_type: string | null
  relation_description: string | null
  direction: string | null
  target: {
    id: string
    slug: string
    name: string
    image_url: string | null
  } | null
}
