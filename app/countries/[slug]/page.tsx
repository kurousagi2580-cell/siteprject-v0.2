
import { notFound } from "next/navigation"
import { AppImage } from "@/components/app-image"
import { SiteShell } from "@/components/layout/site-shell"
import { Surface } from "@/components/ui/surface"
import MapClient from "@/components/maps/map-client"
import { UpdateLogSection } from "@/components/update-log-section"
import RegionGrid from "@/components/region/region-grid"
import { getCountryJoinRegion } from "@/lib/supabase/queries/contries"
import { getUpdateLogListByType } from "@/actions/updatelogs-actions-server"

export default async function RegionListPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const type = "country"

  const country = await getCountryJoinRegion(slug)

  if (!country) notFound()

  const markers = (country.regions ?? []).map((r) => ({
    slug: r.slug ?? "",
    name: r.name ?? "",
    x: r.map_x ?? 0,
    y: r.map_y ?? 0,
  }))

  const updates = (await getUpdateLogListByType(type)).items ?? []

  return (
    <SiteShell>

      {/* 国のアイキャッチ */}
      <Surface
        variant="raised"
        className="relative h-52 md:h-72 flex items-center justify-center overflow-hidden"
      >
        <AppImage
          src={country.image_url || "/noimage.png"}
          alt={country.name}
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="object-cover rounded-sm"
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
        <MapClient src={country.image_url ?? undefined} markers={markers} />
      </div>

      {/* ▼ 地域一覧セクション ▼ */}
      <RegionGrid regions={country.regions ?? []} />

      {/* 更新ログ */}
      <UpdateLogSection updates={updates} subtitle="最近更新された情報" />

    </SiteShell>
  )
}
