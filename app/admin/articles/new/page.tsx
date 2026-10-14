

import ArticleForm from "@/components/entities/article/article-form";
import { getPageList } from "@/actions/pages-actions-server";

export default async function Page() {
  const pageData = await getPageList() ?? [];
  return <ArticleForm mode="create" pageData={pageData} />;
}
