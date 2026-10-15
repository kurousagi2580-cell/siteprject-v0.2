
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import CommentSection from "@/components/section/comment-section"
import { Surface } from "@/components/ui/surface"
import { getPageBySlug } from "@/actions/pages-actions-server"
import { getArticleListByPage } from "@/actions/articles-actions-server"
import { getCharacterDetail } from "@/lib/supabase/queries/characters"
import { mergeRelations } from "@/lib/characters/merge-character-relation"
import { ProfileSection } from "@/components/section/profile-section"
import { SkillsSection } from "@/components/section/skills-section"
import { RelationsSection } from "@/components/section/relations-section"
import { RelatedArticlesSection } from "@/components/section/related-articles-section"
import { unstable_rethrow } from "next/navigation"

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

    const pageNavItems = [
      { label: "基本情報", href: "#overview" },
      { label: "スキル", href: "#skills" },
      { label: "関連人物", href: "#relations" },
      { label: "関連記事", href: "#related-articles" },
      { label: "コメント", href: "#comments" },
    ]

    return (
      <SiteShell pageNavItems={pageNavItems}>

        {/* アイキャッチ */}
        <Surface
          variant="raised"
          className="h-40 md:h-52 flex items-center justify-center"
        >
          アイキャッチ画像
        </Surface>

        <ProfileSection character={character} />
        <SkillsSection />
        <RelationsSection relations={relations} />
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
