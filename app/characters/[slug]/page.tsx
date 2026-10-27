
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import CommentSection from "@/components/section/comment-section"
import { getPageByResource, getPageBySlug } from "@/actions/pages-actions-server"
import { getArticleListByPage } from "@/actions/articles-actions-server"
import { getCharacterDetail, getCharacterSkills, getCharacterStats } from "@/lib/supabase/queries/characters"
import { mergeRelations } from "@/lib/characters/merge-character-relation"
import { ProfileSection } from "@/components/section/profile-section"
import { SkillsSection } from "@/components/section/skills-section"
import { StatsSection } from "@/components/section/stats-section"
import { RelationsSection } from "@/components/section/relations-section"
import { RelatedArticlesSection } from "@/components/section/related-articles-section"
import { unstable_rethrow } from "next/navigation"
import Link from "next/link"
import { resolveImageSrc, stripHtmlToPlainText } from "@/lib/utils/image-url"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const character = await getCharacterDetail(slug)

  if (!character) {
    return { title: "キャラクター" }
  }

  const descriptionText = stripHtmlToPlainText(character.description ?? "") || `${character.name}のキャラクター詳細ページです。`
  const description = descriptionText.length > 120 ? `${descriptionText.slice(0, 117).trimEnd()}...` : descriptionText

  return {
    title: character.name,
    description,
    openGraph: {
      title: character.name,
      description,
      images: character.image_url ? [resolveImageSrc(character.image_url) ?? ""] : undefined,
    },
  }
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const [character, pageFallback, maybePage] = await Promise.all([
      getCharacterDetail(slug),
      getPageBySlug(slug),
      Promise.resolve(null),
    ])

    if (!character) {
      notFound()
    }

    const pageByResource = await getPageByResource("characters", character.id)
    const page = pageByResource ?? pageFallback

    const [relatedArticle, skills, stats] = await Promise.all([
      page ? getArticleListByPage(page.id).then((result) => result.items) : Promise.resolve([]),
      getCharacterSkills(character.id),
      getCharacterStats(character.id),
    ])

    const relations = mergeRelations(character)
    const showSkills = skills.length > 0
    const showStats = stats.length > 0

    const pageNavItems = [
      { label: "基本情報", href: "#overview" },
      ...(showSkills ? [{ label: "スキル", href: "#skills" }] : []),
      ...(showStats ? [{ label: "ステータス", href: "#stats" }] : []),
      { label: "関連人物", href: "#relations" },
      ...(relatedArticle.length > 0 ? [{ label: "関連記事", href: "#related-articles" }] : []),
      ...(page ? [{ label: "コメント", href: "#comments" }] : []),
    ]

    return (
      <SiteShell pageNavItems={pageNavItems}>

        <nav aria-label="パンくずリスト" className="mb-5 text-xs text-ananta-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="text-ananta-muted no-underline hover:text-ananta-text">
                TOP
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/aggregate/characters"
                className="text-ananta-muted no-underline hover:text-ananta-text"
              >
                キャラクター図鑑
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ananta-text">
              {character.name}
            </li>
          </ol>
        </nav>

        <ProfileSection character={character} />
        {showSkills && <SkillsSection skills={skills} />}
        {showStats && <StatsSection stats={stats} />}
        <RelationsSection relations={relations} slug={slug} />
        {relatedArticle.length > 0 && (
          <RelatedArticlesSection articles={relatedArticle} entitySlug={slug} entityType="characters" />
        )}
        {page && <CommentSection pageId={page.id} />}

      </SiteShell>
    )
  } catch (err) {
    unstable_rethrow(err)
    console.error("CharacterDetailPage DB error:", err)
    throw err
  }
}
