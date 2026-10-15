
import { LinkCardBox } from "@/components/ui/link-card-box"
import { AppImage } from "@/components/app-image"
import type { CharacterJoinAffiliation } from "@/types/character"
import { ASPECT } from "@/lib/image-aspect"

export function CharacterCard({ character }: { character: CharacterJoinAffiliation }) {
  return (
    <LinkCardBox
      key={character.slug}
      href={`/characters/${character.slug}`}
      className="w-full hover:opacity-90"
    >
      {/* 親は高さを持たない */}
      <div className={`relative w-full ${ASPECT.CHARACTER_CARD} bg-ananta-surface rounded-sm overflow-hidden`}>
        <AppImage
          src={character.image_url || "/noimage.png"}
          alt={character.short_name ?? ""}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
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
