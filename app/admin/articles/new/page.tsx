import ArticleForm from "@/components/admin/article-form"
import { getPages } from "@/lib/supabase/get-pages"

export default async function Page() {
  const pageData = await getPages() ?? []
  return <ArticleForm mode= "create" pageData={pageData}/>
}
