
import { SiteShell } from "@/components/layout/site-shell"
import { AppImage } from "@/components/app-image"
import { Surface } from "@/components/ui/surface"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { LinkCardBox } from "@/components/ui/link-card-box"
import { Section } from "@/components/ui/section"
import { listCountries } from "@/lib/supabase/queries/contries"
import { ASPECT } from "@/lib/image-aspect"


export default async function CountryListPage() {

  const countries = (await listCountries()).items
  
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
                  <div className={`relative w-full ${ASPECT.MAP_CARD} bg-ananta-surface flex items-center justify-center`}>
                    <AppImage
                      src={c.image_url || "/noimage.png"}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover rounded-sm"
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
