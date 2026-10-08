"use client"

import Link from "next/link"
import { sidebarNav } from "../nav-items"


export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 text-sm">
      <p className="mb-2 text-xs font-bold text-ananta-muted">サイドバー</p>
      {sidebarNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded px-2 py-1.5 text-ananta-text hover:bg-ananta-surface"
        >
          ▸ {item.label}
        </Link>
      ))}
    </nav>
  )
}