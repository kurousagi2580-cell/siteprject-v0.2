
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import CommentSection from "@/components/section/comment-section"
import { Surface } from "@/components/ui/surface"
import { getPageBySlug } from "@/actions/pages-actions-server"
import { getArticleListByPage } from "@/actions/articles-actions-server"
import { getCharacterDetail } from "@/lib/supabase/queries/characters"
import { mergeRelations } from "@/lib/characters/merg-character-relation"
import { ProfileSection } from "@/components/section/profile-section"
import { SkillsSection } from "@/components/section/skills-section"
import { RelationsSection } from "@/components/section/relations-section"
import { RelatedArticlesSection } from "@/components/section/related-articles-section"

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const page = await getPageBySlug(slug)

    if (!page) notFound()

    const relatedArticle = (await getArticleListByPage(page.id)).items

    const character = await getCharacterDetail(slug)

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
    // サーバー側ログに詳細を出す
    console.error("CharacterDetailPage DB error:", err);
    // ユーザー向けは汎用メッセージ
    return <div>データの取得中にエラーが発生しました。</div>;
  }
}
