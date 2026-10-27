import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import { AppImage } from "@/components/app-image"
import { ExternalLink } from "@/components/external-link"
import CommentSection from "@/components/section/comment-section"
import { getWordBySlug } from "@/actions/words-actions-server"
import { getPageByResource } from "@/actions/pages-actions-server"
import { parseRelatedLinks } from "@/lib/utils/parse-related-links"
import { resolveImageSrc, stripHtmlToPlainText } from "@/lib/utils/image-url"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const word = await getWordBySlug(slug)

  if (!word) {
    return { title: "用語" }
  }

  const descriptionText = stripHtmlToPlainText(word.description ?? "") || `${word.keyword ?? "用語"}の説明です。`
  const description = descriptionText.length > 120 ? `${descriptionText.slice(0, 117).trimEnd()}...` : descriptionText

  return {
    title: word.keyword ?? "用語",
    description,
    openGraph: {
      title: word.keyword ?? "用語",
      description,
      images: word.image_url ? [resolveImageSrc(word.image_url) ?? ""] : undefined,
    },
  }
}

export default async function WordDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const word = await getWordBySlug(slug)

  if (!word) {
    notFound()
  }

  const page = await getPageByResource("words", word.id)
  const relatedLinks = parseRelatedLinks(word.related_links)
  const pageNavItems = [
    { label: "概要", href: "#overview" },
    ...(relatedLinks.length > 0 ? [{ label: "関連リンク", href: "#related-links" }] : []),
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
            <Link href="/aggregate/words" className="text-ananta-muted no-underline hover:text-ananta-text">
              用語
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ananta-text">
            {word.keyword ?? "用語"}
          </li>
        </ol>
      </nav>

      <section id="overview" className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {word.image_url && (
            <div className="w-full max-w-xs">
              <AppImage
                src={word.image_url}
                alt={word.keyword ?? "用語"}
                width={600}
                height={400}
                className="w-full rounded-md border border-ananta-border object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-ananta-text">{word.keyword ?? "用語"}</h1>
              {word.category && (
                <span className="rounded-full border border-ananta-border bg-ananta-surface2 px-2 py-1 text-xs text-ananta-muted">
                  {word.category}
                </span>
              )}
            </div>

            {word.read_word && (
              <p className="text-sm text-ananta-muted">読み: {word.read_word}</p>
            )}

            {word.description && (
              <p className="whitespace-pre-wrap text-base leading-relaxed text-ananta-text">
                {word.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {relatedLinks.length > 0 && (
        <section id="related-links" className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-ananta-text">関連リンク</h2>
          <ul className="space-y-2">
            {relatedLinks.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <ExternalLink url={link.url}>
                  {link.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page && (
        <div id="comments">
          <CommentSection pageId={page.id} />
        </div>
      )}
    </SiteShell>
  )
}
