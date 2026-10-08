
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { LinkCardBox } from "@/components/ui/link-card-box"
import { UpdateLogSection } from "@/components/update-log-section"
import { Section } from "@/components/ui/section"
import { DraggableMapWithMarkers } from "@/components/maps/draggable-map-with-markers"
import { fetchData } from "@/lib/supabase/queries"
import type { CountryJoinRegion } from "@/types/country"
import { getUpdateLogs } from "@/lib/supabase/get-updatelogs"

export default async function RegionListPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

    const country = await fetchData<CountryJoinRegion>(
        "countries",
        {
          select: `
            id,
            name,
            short_name,
            image_url,
            description,
            slug,
            regions:regions!regions_parent_id_fkey (
              id,
              name,
              short_name,
              image_url,
              description,
              map_x,
              map_y,
              slug
            )
          `,
          filters: [{ column: "slug", operator: "eq", value: slug }],
          single: true,
        }
      ) 


      console.log("params.slug hex:", Buffer.from(slug).toString("hex"))

  if (!country) notFound()

  const markers = (country.regions ?? []).map((r) => ({
    slug: r.slug ?? "",
    name: r.name ?? "",
    x: r.map_x ?? 0,
    y: r.map_y ?? 0,
  }))

  const updates = await getUpdateLogs("country")

  return (
    <SiteShell>

        {/* 国のアイキャッチ */}
        <Surface
          variant="raised"
          className="h-52 md:h-72 flex items-center justify-center"
        >
          <img
            src={country.image_url || "/noimage.png"}
            alt={country.name}
            className="w-full h-full object-cover rounded-sm"
          />
        </Surface>

        {/* 国名 */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-ananta-text">
            {country.name}
          </h1>
          <p className="text-ananta-muted text-sm">{country.short_name}</p>
        </div>

        {/* 国の説明 */}
        <p className="mt-4 text-sm text-ananta-text whitespace-pre-line">
          {country.description}
        </p>

        {/* ドラッグ＋マーカー付き国マップ */}
        <div className="mt-8 h-64">
          <DraggableMapWithMarkers
            src={country.image_url || "/noimage.png"}
            markers={markers}
            className="w-full ${ASPECT.EYECATCH}"
          />
        </div>

        {/* ▼ 地域一覧セクション ▼ */}
      <Section id="regions">
        <GameSectionTitle
          title="REGIONS"
          subtitle={`${country.name} に属する地域`}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {(country.regions ?? []).map((r) => (
            <LinkCardBox
              key={r.slug}
              href={`/regions/${r.slug}`}
              className="w-full hover:opacity-90"
            >
              <div className="w-full aspect-[4/3] bg-ananta-surface flex items-center justify-center">
                <img
                  src={r.image_url || "/noimage.png"}
                  alt={r.name}
                  className="w-full object-cover rounded-sm"
                />
              </div>
              <div className="mt-2 px-2 pb-2">
                <p className="text-base font-bold text-ananta-text">{r.name}</p>
                <p className="text-sm text-ananta-muted">{r.short_name}</p>
              </div>
            </LinkCardBox>
          ))}
        </div>
      </Section>

        {/* 更新ログ */}
        <UpdateLogSection updates={updates} subtitle="最近更新された県情報" />

    </SiteShell>
  )
}
