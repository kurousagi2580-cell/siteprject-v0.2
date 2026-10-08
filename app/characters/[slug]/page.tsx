
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/site-shell"
import { CommentSection } from "@/components/section/comment-section"
import { Surface } from "@/components/ui/surface"
import { createSupabaseServerClient } from "@/lib/supabase/client"
import { fetchData } from "@/lib/supabase/queries"
import type { Page } from "@/types/page"
import { getComments } from "@/lib/comments"
import { getCharacterDetail } from "@/lib/supabase/get-characters-detail"
import { getRelatedArticles } from "@/lib/supabase/get-related-articles"
import { mergeRelations } from "@/lib/characters/merg-character-relation"
import { ProfileSection } from "@/components/section/profile-section"
import { SkillsSection } from "@/components/section/skills-section"
import { RelationsSection } from "@/components/section/relations-section"
import { RelatedArticlesSection } from "@/components/section/related-articles-section"

const supabase = createSupabaseServerClient()

export default async function CharacterDetailPage({
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

  //console.log("page id："+ page.id)

  const relatedArticle = await getRelatedArticles(page.id)
  //console.log("関連記事"+ relatedArticle[0].id)

  const comments = await getComments(page.id)
  //console.log("コメント："+ comments[0].id)

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
      <RelatedArticlesSection articles={relatedArticle} entitySlug={slug} entityType="characters"/>
      <CommentSection comments={comments} pageId={page.id}/>

    </SiteShell>
  )
}
