export type CharacterStatsRow = {
  character_id?: string | null
  level: number
  stats: Record<string, number | string>
}
