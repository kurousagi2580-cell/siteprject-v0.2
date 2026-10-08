import type { Location } from "@/types/location"

export type RegionJoinLocation = {
  id: string
  name: string
  short_name: string
  parent_id: string // countries.id
  image_url: string
  description: string
  map_x: number
  map_y: number
  slug: string | null
  Locations?: Location[]
}

export type Region = {
  id: string
  name: string
  short_name: string
  parent_id: string // countries.id
  image_url: string
  description: string
  map_x: number
  map_y: number
  slug: string | null
  Locations?: Location[]
}
