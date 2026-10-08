
import { CharacterCard } from "../CharacterCard"
import type { CharacterDetaill } from "@/types/character"


export function CharacterGrid({ characters }: { characters: CharacterDetaill[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {characters.map((c) => (
        <CharacterCard key={c.id} character={c} />
      ))}
    </div>
  )
}
