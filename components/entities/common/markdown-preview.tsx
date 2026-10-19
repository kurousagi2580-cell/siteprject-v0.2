"use client"

import { useEffect, useState } from "react"
import ArticleEmbeds from "@/components/article/article-embeds";
import { renderMarkdownToHtml } from "@/markdown/render";


export function MarkdownPreview({ source }: { source: string }) {
  const [html, setHtml] = useState("")
  const [embedRevision, setEmbedRevision] = useState(0)

  useEffect(() => {
    const t = setTimeout(async () => {
      const html = await renderMarkdownToHtml(source)
      setHtml(String(html))
      setEmbedRevision((revision) => revision + 1)
    }, 200)
    return () => clearTimeout(t)
  }, [source])

  return (
    <>
      <div className="prose prose-invert article-markdown max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      <ArticleEmbeds refreshKey={embedRevision} />
    </>
  )
}
