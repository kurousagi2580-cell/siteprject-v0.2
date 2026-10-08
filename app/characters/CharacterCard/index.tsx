
import { LinkCardBox } from "@/components/ui/link-card-box"
import type { CharacterDetaill } from "@/types/character"
import { ASPECT } from "@/lib/image-aspect"

export function CharacterCard({ character }: { character: CharacterDetaill }) {
  return (
    <LinkCardBox
      key={character.slug}
      href={`/characters/${character.slug}`}
      className="w-full hover:opacity-90"
    >
      {/* 親は高さを持たない */}
      <div className="w-full bg-ananta-surface rounded-sm overflow-hidden">
        <img
          src={character.image_url || "/noimage.png"}
          alt={character.short_name ?? ""}
          className={`w-full ${ASPECT.CHARACTER_CARD} object-cover`}
        />
      </div>

      <div className="mt-2 px-2 pb-2 text-center">
        <span className="text-sm text-ananta-text break-words">
          {character.name}
        </span>
      </div>
    </LinkCardBox>
  )
}

