"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { sidebarNav, type SidebarNavItem } from "../nav-items"

export function SidebarNav({
  items = sidebarNav,
}: {
  items?: SidebarNavItem[]
}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setExpandedItems((current) => {
      const next = { ...current }
      for (const item of items) {
        if (item.children.some((child) => child.href === pathname)) {
          next[item.label] = true
        }
      }
      return next
    })
  }, [items, pathname])

  return (
    <nav aria-label="一覧ページ" className="flex min-h-0 flex-1 flex-col text-sm">
      <p className="mb-2 shrink-0 px-2 text-xs font-bold tracking-wide text-ananta-muted">
        一覧
      </p>
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
        {items.map((item) => {
          const isCurrentGroup = item.children.some(
            (child) => child.href === pathname,
          )
          const isExpanded = expandedItems[item.label] ?? false

          return (
            <li key={item.label}>
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() =>
                setExpandedItems((current) => ({
                  ...current,
                  [item.label]: !current[item.label],
                }))
              }
              className={`flex w-full items-center justify-between gap-2 rounded-full px-3 py-2.5 text-left font-medium no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent ${
                isCurrentGroup
                  ? "bg-yellow-400 text-slate-950 hover:bg-yellow-300"
                  : "text-ananta-text hover:bg-ananta-surface2 hover:text-ananta-accent"
              }`}
            >
              <span>{item.label}</span>
              {isExpanded ? (
                <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
              ) : (
                <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
              )}
            </button>
            {isExpanded && (
              <ul className="ml-4 mt-1 space-y-1 border-l border-ananta-border/70 py-1 pl-3">
                {item.children.map((child) => {
                  const isCurrent = child.href === pathname
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent ${
                          isCurrent
                            ? "font-semibold text-yellow-300"
                            : "text-ananta-muted hover:bg-ananta-surface2 hover:text-ananta-text"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 shrink-0 rounded-full ${
                            isCurrent ? "bg-yellow-300" : "bg-ananta-muted/50"
                          }`}
                        />
                        {child.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}