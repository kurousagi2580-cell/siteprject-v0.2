export type CharacterSkill = {
  id?: string
  character_id?: string | null
  skill_type?: string | null
  name: string
  description: string | null
  cooldown?: number | null
  icon_url?: string | null
  sort_order?: number | null
  created_at?: string | null
  updated_at?: string | null
}
