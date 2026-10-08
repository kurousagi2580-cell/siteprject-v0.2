import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import { UpdateLogSection } from "@/components/update-log-section"
import { CharacterSearchSection } from "./CharacterSearchSection"
import { fetchData } from "@/lib/supabase/queries"
import { getUpdateLogs } from "@/lib/supabase/get-updatelogs"
import type { CharacterDetaill } from "@/types/character"


export default async function CharacterListPage() {

  const characters = await fetchData<CharacterDetaill>(
    "characters",
    {
      select: `
        id,
        name,
        short_name,
        type,
        image_url,
        profile,
        slug,
        affiliation:affiliation_id (
          id,
          name,
          icon_url,
          description,
          category,
          order,
          parent_affiliation_id
        )
      `,
      filters: [
        { column: "type", operator: "eq", value: "プレイアブル" }
      ],
    }
  )

  const updates = await getUpdateLogs("character")

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
