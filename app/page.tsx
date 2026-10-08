import Link from "next/link"
import { FileText, MessageSquare } from "lucide-react"
import { SiteShell } from "@/components/site-shell"
import { pages } from "@/lib/data"
import { getLatestComments } from "@/lib/supabase/get-ltcomments"
import { LinkCardBox } from "@/components/ui/link-card-box"
import { CardPanel } from "@/components/ui/card-panel"
import { Surface } from "@/components/ui/surface"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { fetchData } from "@/lib/supabase/queries"
import type { CharacterDetaill } from "@/types/character"
import type { CountryJoinRegion } from "@/types/country"
import { CharacterGrid } from "./characters/CharacterGrid"
import { ASPECT } from "@/lib/image-aspect"
import { resolvePageUrl } from "@/lib/utils/url-utils"
import { toDateTimeString } from "@/lib/utils/toDateTimeString"

export default async function TopPage() {
  const recommendedPages = pages.filter((p) => p.type === "recommend")

  // ▼▼▼ DB から取得 ▼▼▼

  const comments = await getLatestComments()

  // ページごとに最新コメント1件だけ抽出
  const latestByPage = new Map()
  for (const c of comments) {
    if (!latestByPage.has(c.page.id)) {
      latestByPage.set(c.page.id, c)
    }
  }
  const latestComments = Array.from(latestByPage.values()).slice(0, 5)

  const characters = await fetchData<CharacterDetaill>("characters", {
    select: `
      id,
      name,
      short_name,
      image_url,
      slug,
      created_at
    `,
    order: [{ column: "created_at", ascending: false }],
    limit: 6
  })

  const countries = await fetchData<CountryJoinRegion>("countries", {
    select: `
        id,
        name,
        short_name,
        image_url,
        slug,
        created_at
      `,
    order: [{ column: "created_at", ascending: false }],
    limit: 4
  })

  return (
    <SiteShell rightNavMode="none">

      {/* Eyecatch → Surface に統一 */}
      <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
        ANANTA DATABASE
      </Surface>

      {/* EXPLORE */}
      <Section id="explore">
        <GameSectionTitle title="EXPLORE" subtitle="探索する" />

        <div className="grid grid-cols-2 gap-4">
          {/* 最新情報 */}
          <Link
            href="/news"
            className="block rounded bg-ananta-surface2 border border-ananta-border px-4 py-6 text-center hover:bg-ananta-surface transition"
          >
            <p className="text-sm font-bold text-ananta-text">最新情報</p>
          </Link>

          {/* アップデート情報 */}
          <Link
            href="/updates"
            className="block rounded bg-ananta-surface2 border border-ananta-border px-4 py-6 text-center hover:bg-ananta-surface transition"
          >
            <p className="text-sm font-bold text-ananta-text">アップデート</p>
          </Link>

          {/* イベント情報 */}
          <Link
            href="/events"
            className="block rounded bg-ananta-surface2 border border-ananta-border px-4 py-6 text-center hover:bg-ananta-surface transition"
          >
            <p className="text-sm font-bold text-ananta-text">イベント</p>
          </Link>

          {/* お知らせ */}
          <Link
            href="/notices"
            className="block rounded bg-ananta-surface2 border border-ananta-border px-4 py-6 text-center hover:bg-ananta-surface transition"
          >
            <p className="text-sm font-bold text-ananta-text">お知らせ</p>
          </Link>
        </div>
      </Section>

      {/* DISCOVER */}
      <div className="mt-4 mb-4">
        <GameSectionTitle
          title="DISCOVER"
          subtitle="キャラクター・マップを探索"
        />
      </div>

      {/* キャラ一覧 → CardPanel + CardBox */}
      <CardPanel className="mb-4">
        <div className="mb-4">
          <GameSectionTitle title="CHARACTERS" subtitle="キャラクター一覧" />
        </div>

        <CharacterGrid characters={characters} />
      </CardPanel>

      {/* マップ一覧 → CardPanel + CardBox */}
      <CardPanel className="mb-4">
        <div className="mb-4">
          <GameSectionTitle title="MAPS" subtitle="マップ一覧" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {countries.map((m) => (

            <LinkCardBox key={m.slug} href={`/countries/${m.slug}`} className="w-full hover:opacity-90">
              <div className="w-full bg-ananta-surface rounded-sm overflow-hidden">
                <img
                  src={m.image_url || "/noimage.png"}
                  alt={m.name}
                  className={`w-full ${ASPECT.MAP_CARD} object-cover`}
                />
              </div>

              <div className="mt-2 px-2 pb-2 text-center">
                <span className="text-sm text-ananta-text break-words">
                  {m.name}
                </span>
              </div>
            </LinkCardBox>
          ))}
        </div>
      </CardPanel>

      {/* WORLD */}
      <div className="mt-4 mb-4">
        <GameSectionTitle
          title="WORLD"
          subtitle="ストーリー・勢力・世界観"
        />
      </div>

      <CardPanel>
        <ul className="flex flex-col gap-2 text-sm">
          <li><Link href="/world/story">ストーリー概要</Link></li>
          <li><Link href="/world/factions">勢力・組織</Link></li>
          <li><Link href="/world/history">世界の歴史</Link></li>
        </ul>
      </CardPanel>

      {/* DATABASE */}
      <div className="mt-4 mb-4">
        <GameSectionTitle
          title="DATABASE"
          subtitle="データベース一覧・検索・タグ"
        />
      </div>

      <CardPanel>
        <ul className="flex flex-col gap-2 text-sm">
          <li><Link href="/database/all">全データ一覧</Link></li>
          <li><Link href="/database/search">データ検索</Link></li>
          <li><Link href="/database/tags">タグ一覧</Link></li>
        </ul>
      </CardPanel>

      {/* RECOMMENDED */}
      <div className="mt-4 mb-4">
        <GameSectionTitle
          title="RECOMMENDED"
          subtitle="おすすめページ"
        />
      </div>

      <CardPanel>
        <ul className="flex flex-col gap-2 text-sm">
          {recommendedPages.map((p) => (
            <li key={p.id}>
              <Link href={`/pages/${p.slug}`}>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 shrink-0 text-ananta-muted" />{p.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardPanel>

      {/* 最新コメント付きページ */}
      <div className="mt-4 mb-4">
        <GameSectionTitle
          title="LATEST COMMENTS"
          subtitle="最新コメント付きページ"
        />
      </div>

      <CardPanel>
        <ul className="flex flex-col gap-3 text-sm">
          {latestComments.map((c) => (
            <li key={c.id} className="flex flex-col gap-1">


              <Link href={resolvePageUrl(c.page)}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 shrink-0 text-ananta-muted" />
                  {c.page.title}
                  <span className="text-xs text-ananta-muted">
                    {toDateTimeString(c.created_at)}
                  </span>
                </div>
              </Link>



            </li>
          ))}
        </ul>
      </CardPanel>

    </SiteShell>
  )
}
