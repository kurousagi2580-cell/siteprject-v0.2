import { requireAdminPage } from "@/lib/auth/require-admin";
// src/app/admin/articles/[id]/page.tsx など
import { getArticleById } from "@/actions/articles-actions-server";
import { getPageList } from "@/actions/pages-actions-server";
import ArticleForm from "@/components/entities/article/article-form";

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const pageData = await getPageList() ?? [];

  const article = await getArticleById(id);
  if (!article) return null;

  const safe = { ...article, created_at: article.created_at?.toString?.(), updated_at: article.updated_at?.toString?.() };

  return <ArticleForm mode="edit" initialArticle={safe} pageData={pageData} />;
}
