import { type ReactNode } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { headerNav } from "@/components/nav-items"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { PageNavigation } from "@/components/ui/page-navigation"
import { AdBanner } from "@/components/ui/ad-banner"
import { Search } from "lucide-react"
import MobileSidebarToggle from "@/components/layout/mobile-sidebar-toggle"


export function SiteShell({
  children,
  showFooterAd = true,
  pageNavItems = [],
  headerOffset = 180,      // ← 追加: ヘッダーの高さ＋余裕
  rightNavMode = "nav",        // ← 追加: "nav" | "custom" | "none"
  rightNavContent = null,      // ← 追加: custom 用
}: {
  children: ReactNode
  showFooterAd?: boolean
  pageNavItems?: { label: string; href: string }[]
  headerOffset?: number
  rightNavMode?: "nav" | "custom" | "none"
  rightNavContent?: ReactNode
}) {

  return (
    <div className="min-h-screen bg-transparent text-ananta-text">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-ananta-surface px-4 py-3 border-b border-ananta-border">
        <div className="leading-tight">
          <p className="text-sm font-bold text-ananta-text">ANANTA DATABASE</p>
          <p className="text-xs text-ananta-muted">無限大ANANTAの攻略情報・データベース</p>
        </div>

        {/* デスクトップ用ナビ（md以上で表示） */}
        <nav className="hidden md:flex items-center gap-4 text-sm md:ml-auto">
          {headerNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ananta-muted">
              {item.label}
            </Link>
          ))}

          {/* 検索ボックス（見た目は元と同じ） */}
          <form action="/search" className="relative max-w-[320px] w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-ananta-muted" />
            <input
              type="text"
              name="q"
              placeholder="Search..."
              className="
                h-8 pl-8 pr-3 rounded bg-ananta-surface2 border border-ananta-border
                text-sm text-ananta-text leading-none focus:outline-none focus:ring-1 focus:ring-ananta-accent
              "
            />
          </form>
        </nav>

        {/* モバイル用トグルはヘッダー右側に表示（md:hidden） */}
        <div className="flex items-center gap-2">
          <MobileSidebarToggle
            pageNavItems={pageNavItems}
            headerOffset={headerOffset}
            rightNavMode={rightNavMode}
            rightNavContent={rightNavContent}
          />
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-40 shrink-0 self-start sticky top-20 rounded bg-ananta-surface/50 backdrop-blur-lg border border-ananta-border/40 p-4">
          <SidebarNav />
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>

        {/* Right column */}
        <aside className="hidden w-40 shrink-0 self-start sticky top-20 lg:block">
          

            {rightNavMode === "nav" && (
              <div className="p-4 rounded border border-ananta-border bg-ananta-surface/50 backdrop-blur-lg">
                <PageNavigation items={pageNavItems} headerOffset={headerOffset} />
              </div>
            )}

            {rightNavMode === "custom" && (
              <div className="p-4 rounded border border-ananta-border bg-ananta-surface/50 backdrop-blur-lg">
                <>{rightNavContent}</>
              </div>
            )}

            {rightNavMode === "none" && (
              <div className="text-xs text-ananta-muted text-center">
                {/* 空欄でもOK。領域だけ確保 */}
              </div>
            )}

          
        </aside>
      </div>

      {showFooterAd && (
        <div className="mx-auto max-w-[1400px] px-4 mt-10 mb-6">
          <AdBanner />
        </div>
      )}
    </div>
  )
}
