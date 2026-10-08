"use client"

import { useEffect, useState } from "react"

export function PageNavigation({
  items,
  headerOffset = 180,
}: {
  items: { label: string; href: string }[]
  headerOffset?: number
}) {

  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const sections = items
      .map((item) => {
        const el = document.querySelector(item.href) as HTMLElement | null
        if (!el) return null
        return {
          href: item.href,
          top: el.offsetTop,
        }
      })
      .filter(Boolean) as { href: string; top: number }[]

    const onScroll = () => {
  const scrollPos = window.scrollY + headerOffset
  const bottomPos = window.scrollY + window.innerHeight
  const pageHeight = document.body.scrollHeight

  // 通常の判定
  let current = sections[0]?.href ?? ""
  for (const sec of sections) {
    if (sec.top <= scrollPos) {
      current = sec.href
    } else {
      break
    }
  }

  // ★ ページ最下部に来たら最後のセクションを強制的に active
  if (sections.length > 0 && bottomPos >= pageHeight - 2) {
    current = sections[sections.length - 1].href
}

  setActive(current)
}


    onScroll() // 初期状態も反映
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return

    const headerOffset = 80
    const rect = el.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top - headerOffset

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    })
  }

  return (
    <nav className="flex flex-col gap-2 text-sm">
      <p className="mb-2 text-xs font-bold text-ananta-muted">CONTENTS</p>

      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={
            active === item.href
              ? "rounded px-2 py-1.5 bg-ananta-accent text-white"
              : "rounded px-2 py-1.5 text-ananta-text hover:bg-ananta-surface"
          }
        >
          ▸ {item.label}
        </a>
      ))}
    </nav>
  )
}
