
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import CommentSection from "@/components/section/comment-section"
import { getPageBySlug } from "@/actions/pages-actions-server"
import { getArticleListByPage } from "@/actions/articles-actions-server"
import { getCharacterDetail } from "@/lib/supabase/queries/characters"
import { mergeRelations } from "@/lib/characters/merge-character-relation"
import { ProfileSection } from "@/components/section/profile-section"
import { SkillsSection } from "@/components/section/skills-section"
import { RelationsSection } from "@/components/section/relations-section"
import { RelatedArticlesSection } from "@/components/section/related-articles-section"
import { unstable_rethrow } from "next/navigation"
import Link from "next/link"

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const [page, character] = await Promise.all([
      getPageBySlug(slug),
      getCharacterDetail(slug),
    ])

    if (!page) notFound()

    const relatedArticle = (await getArticleListByPage(page.id)).items

    if (!character || null) notFound()

    const relations = mergeRelations(character)
    const showSkills = character.type !== "NPC" && character.type !== "調査中"

    const pageNavItems = [
      { label: "基本情報", href: "#overview" },
      ...(showSkills ? [{ label: "スキル", href: "#skills" }] : []),
      { label: "関連人物", href: "#relations" },
      { label: "関連記事", href: "#related-articles" },
      { label: "コメント", href: "#comments" },
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
        {showSkills && <SkillsSection />}
        <RelationsSection relations={relations} slug={slug} />
        <RelatedArticlesSection articles={relatedArticle} entitySlug={slug} entityType="characters" />
        <CommentSection pageId={page.id} />

      </SiteShell>
    )
  } catch (err) {
    unstable_rethrow(err)          // notFound / redirect は再 throw
    console.error("CharacterDetailPage DB error:", err)
    throw err                      // app/error.tsx に任せる
  }
}
