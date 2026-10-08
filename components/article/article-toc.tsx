"use client"

import { articleHeadingsStore } from "@/types/articles/heading-store"

// ▼ このファイル内で型を定義（外部ファイル不要）
type PageNavItem = {
  label: string
  href: string
}

export function ArticleToc(): PageNavItem[] {
  const { headings } = articleHeadingsStore()

  // 見出し → pageNavItems に変換
  const items: PageNavItem[] = headings.map((h) => ({
    label: h.text,
    href: `#${h.id}`,
  }))

  return items
}