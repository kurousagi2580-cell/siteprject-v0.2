export type CharacterRelationshipPosition = {
  id: string
  diagram_key: string
  character_id: string
  position_x: number
  position_y: number
  position_mode: "manual" | "auto"
  group_key: string | null
  is_visible: boolean
  sort_order: number
  updated_at: string
}
