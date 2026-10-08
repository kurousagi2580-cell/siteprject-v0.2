
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { LinkCardBox } from "@/components/ui/link-card-box"
import { Section } from "@/components/ui/section"
import { fetchData } from "@/lib/supabase/queries"
import type { CountryJoinRegion } from "@/types/country"
import { ASPECT } from "@/lib/image-aspect"


export default async function CountryListPage() {

  const countries = await fetchData<CountryJoinRegion>(
      "countries",
      {
        select: `id, name, short_name, image_url, description, slug`,
      }
    ) 

  

  return (
    <SiteShell>
      

        {/* アイキャッチ */}
        <Surface
          variant="raised"
          className="h-52 md:h-64 flex items-center justify-center text-xl font-bold"
        >
          国一覧アイキャッチ
        </Surface>

        {/* ▼▼▼ 国一覧セクション ▼▼▼ */}
        <Section id="countries">
          <GameSectionTitle
            title="COUNTRIES"
            subtitle="世界を構成する国一覧"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2">
            {countries.map((c) => (
              
                <LinkCardBox key={c.slug} href={`/countries/${c.slug}`} className="w-full hover:opacity-90">

                  {/* サムネイル */}
                  <div className={`w-full ${ASPECT.MAP_CARD} bg-ananta-surface flex items-center justify-center`}>
                    <img
                      src={c.image_url || "/noimage.png"}
                      alt={c.name}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>

                  {/* 国名 */}
                  <div className="mt-2 px-2 pb-2">
                    <p className="text-base font-bold text-ananta-text">
                      {c.name}
                    </p>
                    {/*<p className="text-sm text-ananta-muted">{c.short_name}</p>*/}
                  </div>

                </LinkCardBox>
              
            ))}
          </div>
        </Section>

      
    </SiteShell>
  )
}
