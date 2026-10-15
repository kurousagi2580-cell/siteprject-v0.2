import { requireAdminPage } from "@/lib/auth/require-admin";
import ArticleForm from "@/components/entities/article/article-form";
import { getPageList } from "@/actions/pages-actions-server";

export default async function Page() {
  await requireAdminPage();
  const pageData = await getPageList() ?? [];
  return <ArticleForm mode="create" pageData={pageData} />;
}
