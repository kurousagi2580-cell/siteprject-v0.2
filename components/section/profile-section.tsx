// components/character/ProfileSection.tsx
import { CardBox } from "@/components/ui/card-box"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { ASPECT } from "@/lib/image-aspect"
import type { CharacterDetaill } from "@/types/character"

export function ProfileSection({
  character,
}: {
  character: CharacterDetaill
}) {
  return (
    <Section id="overview">
      <GameSectionTitle
        title="PROFILE"
        subtitle="キャラクターの基本情報"
      />

      <div className="flex flex-col gap-4 md:flex-row">
        {/* サムネイル */}
        <CardBox
          className={`${ASPECT.CHARACTER_CARD} w-full flex items-center justify-center text-base md:w-[300px] md:shrink-0`}
        >
          <img
            src={character.image_url || "/noimage.png"}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </CardBox>

        {/* プロフィール */}
        <CardPanel className="flex-1 pl-4">
          <dl className="flex flex-col gap-4 text-lg">

            <div className="flex items-center gap-3 border-b border-ananta-border pb-3">
              <dt className="font-bold text-ananta-text">名前：</dt>
              <dd className="text-ananta-muted">{character.name}</dd>
            </div>

            <div className="flex items-center gap-3 border-b border-ananta-border pb-3">
              <dt className="font-bold text-ananta-text">所属：</dt>
              <dd className="text-ananta-muted">
                {character.affiliation?.name || "—"}
              </dd>
            </div>

            <div className="flex flex-col gap-3 border-ananta-border pb-3">
              <dt className="font-bold text-ananta-text">プロフィール：</dt>

              <dd className="text-ananta-muted pl-4 flex flex-col gap-2 text-base">

                <div className="flex gap-4">
                  <span className="font-semibold w-20 text-ananta-text">年齢</span>
                  <span>{character.profile?.age ?? "—"}</span>
                </div>

                <div className="flex gap-4">
                  <span className="font-semibold w-20 text-ananta-text">身長</span>
                  <span>
                    {character.profile?.height
                      ? `${character.profile.height} cm`
                      : "—"}
                  </span>
                </div>

                <div className="flex gap-4">
                  <span className="font-semibold w-20 text-ananta-text">誕生日</span>
                  <span>{character.profile?.birthday ?? "—"}</span>
                </div>

                <div className="flex gap-4">
                  <span className="font-semibold w-20 text-ananta-text">好きなもの</span>
                  <span>{character.profile?.favorites?.join(", ") ?? "—"}</span>
                </div>

                <div className="flex gap-4">
                  <span className="font-semibold w-20 text-ananta-text">CV</span>
                  <span>{character.profile?.voice_actor ?? "—"}</span>
                </div>

              </dd>
            </div>

          </dl>
        </CardPanel>
      </div>
    </Section>
  )
}
