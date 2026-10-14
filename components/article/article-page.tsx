// components/article/article-page.tsx
import React from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Surface } from "@/components/ui/surface";
import ArticleBody from "@/components/article/article-body";
import { extractHeadings } from "@/markdown/headings";
import { renderMarkdownToHtml } from "@/markdown/render";
import type { Article } from "@/types/article";
import { buildEntityUrl } from "@/lib/utils/url-utils";
import { getArticleById, getArticleBySlug } from "@/actions/articles-actions-server";

type Props = {
  id?: string;
  slug?: string;
  entitySlug?: string;
  entityType?: string;
  preview?: boolean; // 編集画面から渡すフラグ（編集用に true を渡す）
};

export default async function ArticlePage({ id, slug, entitySlug, entityType, preview = false }: Props) {
  let article: Article | null = null;

  if (id) {
    article = await getArticleById(id)
  } else if (slug) {
    article = await getArticleBySlug(slug)
  } else {
    return <p className="px-6 py-10">記事が見つかりません</p>;
  }

  if (!article) {
    return <p className="px-6 py-10">記事が見つかりません</p>;
  }

  // サーバーで見出し抽出とサニタイズ済み HTML を生成
  const headings = await extractHeadings(article.body ?? "");
  const pageNavItems = headings
    .filter(h => typeof h.id === "string" && h.id.trim().length > 0)
    .map(({ id, text }) => ({
      label: text,
      href: `#${id}`,
    }));

  const html = await renderMarkdownToHtml(article.body ?? "");

  return (
    <SiteShell pageNavItems={pageNavItems} headerOffset={80}>
      <Surface variant="raised" className="bg-ananta-surface/40 backdrop-blur-xl border border-ananta-border/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.45)] rounded-xl p-6 md:p-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-xs font-medium text-ananta-muted tracking-wide uppercase">{article.category}</span>
          <h1 className="text-2xl font-bold text-ananta-text">{article.title}</h1>
          <div className="flex items-center justify-between text-xs text-ananta-muted">
            <span>更新日 {article.updated_at?.slice(0, 10)}</span>
            {article.slug && article.title && (
              <a href={buildEntityUrl(entityType ?? "", entitySlug ?? "", article.slug ?? "")} className="underline">
                ← {article.title} に戻る
              </a>
            )}
          </div>
        </header>

        <hr className="border-ananta-border/500" />

        {article.eyecatch && <div className="mb-4">{article.eyecatch}</div>}

        <div className="prose prose-invert max-w-none">


          <ArticleBody html={html} headings={headings} />

        </div>

        <hr className="border-ananta-border/500" />
      </Surface>
    </SiteShell>
  );
}
