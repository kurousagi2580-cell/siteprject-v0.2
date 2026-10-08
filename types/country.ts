import type { RegionJoinLocation } from "@/types/region"

export type CountryJoinRegion = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  description: string | null
  slug: string | null
  regions?: RegionJoinLocation[]
}

export type Country = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  description: string | null
  slug: string | null
  created_at: string | null
}