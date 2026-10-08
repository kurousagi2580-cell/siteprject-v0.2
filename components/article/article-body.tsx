"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import { useEffect, useRef } from "react"
import { articleHeadingsStore } from "@/types/articles/heading-store"
import type { Heading } from "@/types/articles/heading"
import { YouTubeEmbed } from "@/components/embed/youtube"
import { XEmbed } from "@/components/embed/x"
import { extractRatio } from "@/lib/article/markdown"
import remarkGfm from "remark-gfm"


type ArticleBodyProps = {
  body: string
}

export default function ArticleBody({ body }: ArticleBodyProps) {
  const { setHeadings } = articleHeadingsStore()
  const headingsRef = useRef<Heading[]>([])
  const components: Components = {
    // ============================
    // 見出し（既存）
    // ============================
    h2: ({ children }) => {
      const text: string = String(children)
      const id: string = text.toLowerCase().replace(/\s+/g, "-")

      headingsRef.current.push({ id, text, level: 2 })

      return (
        <h2
          id={id}
          className="text-2xl font-bold mt-4 mb-4 border-l-4 border-ananta-accent pl-3"
        >
          {children}
        </h2>
      )
    },

    h3: ({ children }) => {
      const text: string = String(children)
      const id: string = text.toLowerCase().replace(/\s+/g, "-")

      headingsRef.current.push({ id, text, level: 3 })

      return (
        <h3
          id={id}
          className="text-xl font-semibold mt-6 mb-3 text-ananta-muted"
        >
          {children}
        </h3>
      )
    },

    // ============================
    // 画像
    // ============================
    img: ({ src, alt }) => {
      return (
        <img
          src={src ?? ""}
          alt={alt ?? ""}
          style={{
            width: "100%",        // 横幅いっぱい
            maxWidth: "640px",    // 最大幅を指定（ここを変えればサイズ変更）
            height: "auto",       // アスペクト比維持
            borderRadius: "8px",  // 任意
            display: "block",
            margin: "20px 0",
          }}
        />
      )
    },

    // ============================
    // URL 埋め込み（pタグで処理）
    // ============================
    p: ({ children }) => {
      // children が配列の場合がほとんど
      const first = Array.isArray(children) ? children[0] : children

      // ReactMarkdown の text node は { type: "text", value: "..." }
      const text =
        typeof first === "string"
          ? first.trim()
          : typeof first === "object" && first !== null && "props" in first
            ? String(first.props?.children ?? "").trim()
            : ""

      // --- YouTube ---
      const ytMatch = text.match(/https?:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/)
      if (ytMatch) {
        return <YouTubeEmbed videoId={ytMatch[1]} />
      }

      // --- X(Twitter) ---
      const xMatch = text.match(/https?:\/\/x\.com\/[^\/]+\/status\/(\d+)/)
      if (xMatch) {
        return <XEmbed tweetUrl={text} />
      }

      return <p>{children}</p>
    },
    code({ className, children }) {
      if (className === "language-html") {
        return (
          <div dangerouslySetInnerHTML={{ __html: String(children ?? "") }} />
        )
      }
      return <code>{children}</code>
    }
  }

  useEffect(() => {
    setHeadings(headingsRef.current)
  }, [setHeadings])

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml={false}   // ← HTMLを通す
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
