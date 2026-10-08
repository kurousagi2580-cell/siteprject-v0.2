import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText } from "lucide-react"
import { SiteShell } from "@/components/site-shell"
import { CommentSection } from "@/components/section/comment-section"
import { CardBox } from "@/components/ui/card-box"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { fetchData } from "@/lib/supabase/queries"
import type { RegionJoinLocation } from "@/types/region"
import type { Page } from "@/types/page"
import { getComments } from "@/lib/comments"

// ローカルデータ（変更しない）
import { mapEnemies, mapDrops, mapRoute, pages } from "@/lib/data"

export default async function MapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const page = await fetchData<Page>("pages", {
    select: "id, slug, title",
    filters: [{ column: "slug", operator: "eq", value: slug }],
    single: true,
  })

  if (!page) notFound()

  const comments = await getComments(page.id)

  // ▼▼▼ DB からマップを取得 ▼▼▼
  const map = await fetchData<RegionJoinLocation>("regions", {
    select: `
      id,
      name,
      short_name,
      image_url,
      description,
      map_x,
      map_y,
      locations:locations!locations_parent_region_id_fkey (
        id,
        name,
        fast_travel,
        x,
        y
      )
    `,
    filters: [{ column: "slug", operator: "eq", value: slug }],
    single: true,
  })

  if (!map) notFound()

  const relatedPages = pages.slice(0, 3)

  const pageNavItems = [
    { label: "OVERVIEW", href: "#overview" },
    { label: "MAP", href: "#structure" },
    { label: "ENEMIES", href: "#enemies" },
    { label: "DROPS", href: "#drops" },
    { label: "ROUTE", href: "#route" },
    { label: "RELATED", href: "#related" },
  ]

  return (
    <SiteShell pageNavItems={pageNavItems} rightNavMode="nav">

      {/* Eyecatch */}
      <CardBox className="h-52 md:h-72 flex items-center justify-center">
        <img
          src={map.image_url || "/noimage.png"}
          alt={map.name}
          className="w-full object-cover rounded-sm"
        />
      </CardBox>

      {/* ▼▼▼ 概要 ▼▼▼ */}
      <Section id="overview">
        <GameSectionTitle
          title="OVERVIEW"
          subtitle="マップ概要"
        />

        <CardPanel>
          <p className="whitespace-pre-line text-sm text-ananta-text">
            {map.description}
          </p>
        </CardPanel>
      </Section>

      {/* ▼▼▼ マップ構造 ▼▼▼ */}
      <Section id="structure">
        <GameSectionTitle
          title="MAP STRUCTURE"
          subtitle="フロア構成図・地形情報"
        />

        <CardBox className="h-72 md:h-96 flex items-center justify-center">
          マップ図（フロア構成図プレースホルダー）
        </CardBox>

        <p className="text-xs text-ananta-link">
          * 隠しルート: エリアBの右側壁面に隠し通路あり
        </p>
      </Section>

      {/* ▼▼▼ 出現エネミー ▼▼▼ */}
      <Section id="enemies">
        <GameSectionTitle
          title="ENEMIES"
          subtitle="出現する敵一覧"
        />

        <CardPanel className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-ananta-surface2 text-ananta-muted">
              <tr>
                <th className="px-3 py-2">エネミー名</th>
                <th className="px-3 py-2">Lv</th>
                <th className="px-3 py-2">属性</th>
                <th className="px-3 py-2">弱点</th>
                <th className="px-3 py-2">ドロップ</th>
              </tr>
            </thead>
            <tbody>
              {mapEnemies.map((e) => (
                <tr key={e.name} className="border-t border-ananta-border">
                  <td className="px-3 py-2 text-ananta-text">{e.name}</td>
                  <td className="px-3 py-2 text-ananta-text">{e.lv}</td>
                  <td className="px-3 py-2 text-ananta-text">{e.attr}</td>
                  <td className="px-3 py-2 text-ananta-text">{e.weak}</td>
                  <td className="px-3 py-2 text-ananta-text">{e.drop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardPanel>
      </Section>

      {/* ▼▼▼ ドロップアイテム ▼▼▼ */}
      <Section id="drops">
        <GameSectionTitle
          title="DROPS"
          subtitle="入手可能アイテム"
        />

        <CardPanel>
          <ul className="flex flex-col gap-3 text-sm text-ananta-text">
            {mapDrops.map((d) => (
              <li key={d}>◆ {d}</li>
            ))}
          </ul>
        </CardPanel>
      </Section>

      {/* ▼▼▼ 攻略ルート ▼▼▼ */}
      <Section id="route">
        <GameSectionTitle
          title="ROUTE"
          subtitle="推奨攻略ルート"
        />

        <CardPanel>
          <p className="mb-2 text-sm font-bold text-ananta-text">
            【推奨ルート】
          </p>
          <ol className="flex flex-col gap-1 text-sm text-ananta-muted">
            {mapRoute.map((r, i) => (
              <li key={r}>
                {i + 1}. {r}
              </li>
            ))}
          </ol>
        </CardPanel>
      </Section>

      {/* ▼▼▼ 関連ページ ▼▼▼ */}
      <Section id="related">
        <GameSectionTitle
          title="RELATED"
          subtitle="関連ページ"
        />

        <CardPanel>
          <ul className="flex flex-col gap-3 text-sm">
            {relatedPages.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-ananta-muted" />
                <Link
                  href={`/pages/${p.slug}`}
                  className="text-ananta-text hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </CardPanel>
      </Section>

      {/* ▼▼▼ コメント ▼▼▼ */}
      <Section id="comments">
        <CommentSection comments={comments} pageId={page.id}/>
      </Section>

    </SiteShell>
  )
}
