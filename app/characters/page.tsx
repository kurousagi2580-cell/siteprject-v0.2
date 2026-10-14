import { SiteShell } from "@/components/layout/site-shell"
import { Surface } from "@/components/ui/surface"
import { UpdateLogSection } from "@/components/update-log-section"
import { CharacterSearchSection } from "@/components/character/character-seach-section"
import { getCharacterJoinAffiliation } from "@/lib/supabase/queries/characters"
import { getUpdateLogListByType } from "@/actions/updatelogs-actions-server"
import { notFound } from "next/navigation"

export default async function CharacterListPage() {

const type = "character"
const characters = await getCharacterJoinAffiliation();

if (!characters) notFound();

  const updates = (await getUpdateLogListByType(type)).items ?? []

  return (
    <SiteShell>

      <Surface
        variant="raised"
        className="h-52 md:h-64 flex items-center justify-center text-xl font-bold"
      >
        キャラクター一覧アイキャッチ
      </Surface>

      <CharacterSearchSection
        characters={characters}
      />


      <UpdateLogSection updates={updates} subtitle="最近追加されたキャラクター" />


    </SiteShell>
  )
}
