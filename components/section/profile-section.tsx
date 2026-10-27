import { CardBox } from "@/components/ui/card-box"
import { AppImage } from "@/components/app-image"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { ASPECT } from "@/lib/image-aspect"
import type { CharacterDetaill } from "@/types/character"

export function ProfileSection({ character }: { character: CharacterDetaill }) {
  const profile = character.profile ?? null

  const rows = [
    profile?.age != null ? { label: "年齢", value: `${profile.age}` } : null,
    profile?.height != null ? { label: "身長", value: `${profile.height} cm` } : null,
    profile?.birthday ? { label: "誕生日", value: profile.birthday } : null,
    profile?.favorites && profile.favorites.length > 0 ? { label: "好きなもの", value: profile.favorites.join(", ") } : null,
    profile?.voice_actor ? { label: "CV", value: profile.voice_actor } : null,
    character.epithet ? { label: "二つ名", value: character.epithet } : null,
    character.release_version ? { label: "実装バージョン", value: character.release_version } : null,
    character.release_date ? { label: "実装日", value: character.release_date } : null,
    character.description ? { label: "紹介文", value: character.description } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Section id="overview">
      <GameSectionTitle title="PROFILE" subtitle="キャラクターの基本情報" />

      <div className="flex flex-col gap-4 md:flex-row">
        <CardBox
          className={`relative ${ASPECT.CHARACTER_CARD} w-full overflow-hidden flex items-center justify-center text-base md:w-[300px] md:shrink-0`}
        >
          <AppImage
            src={character.image_url || "/noimage.png"}
            alt={character.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        </CardBox>

        <CardPanel className="flex-1 pl-4">
          <dl className="flex flex-col gap-4 text-lg">
            <div className="flex items-center gap-3 border-b border-ananta-border pb-3">
              <dt className="font-bold text-ananta-text">名前：</dt>
              <dd className="text-ananta-muted">{character.name}</dd>
            </div>

            {character.affiliation?.name ? (
              <div className="flex items-center gap-3 border-b border-ananta-border pb-3">
                <dt className="font-bold text-ananta-text">所属：</dt>
                <dd className="text-ananta-muted">{character.affiliation.name}</dd>
              </div>
            ) : null}

            {rows.length > 0 ? (
              <div className="flex flex-col gap-3 border-ananta-border pb-3">
                <dt className="font-bold text-ananta-text">プロフィール：</dt>
                <dd className="text-ananta-muted pl-4 flex flex-col gap-2 text-base">
                  {rows.map((row) => (
                    <div key={row.label} className="flex gap-4">
                      <span className="font-semibold w-28 shrink-0 text-ananta-text">{row.label}</span>
                      <span className="min-w-0 break-words">{row.value}</span>
                    </div>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>

          {character.updated_at ? (
            <p className="mt-4 text-right text-xs text-ananta-muted">
              更新日: {new Date(character.updated_at).toLocaleDateString("ja-JP")}
            </p>
          ) : null}
        </CardPanel>
      </div>
    </Section>
  )
}

