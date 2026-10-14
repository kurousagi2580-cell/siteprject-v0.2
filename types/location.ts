export type Location = {
  id: string
  name: string
  fast_travel: boolean
  x: number
  y: number
  parent_region_id: string // game_regions.id
  slug: string
  created_at: string
}
