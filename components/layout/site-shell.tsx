
import { type ReactNode } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { sidebarNav } from "@/components/nav-items"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { PageNavigation } from "@/components/ui/page-navigation"
import { AdBanner } from "@/components/ui/ad-banner"
import MobileSidebarToggle from "@/components/layout/mobile-sidebar-toggle"

type PageNavItem = {
  label: string
  href: string
}

type SiteShellProps = {
  children: ReactNode
  showFooterAd?: boolean
  showSidebar?: boolean
  pageNavItems?: PageNavItem[]
  headerOffset?: number
  rightNavMode?: "nav" | "custom" | "none"
  rightNavContent?: ReactNode
}

export function SiteShell({
  children,
  showFooterAd = true,
  showSidebar = false,
  pageNavItems = [],
  headerOffset = 180,
  rightNavMode = "nav",
  rightNavContent = null,
}: SiteShellProps) {
  // 表示する内容がある場合だけ右カラムを確保する
  const showRightNav =
    (rightNavMode === "nav" && pageNavItems.length > 0) ||
    (rightNavMode === "custom" && rightNavContent != null)

  const layoutColumns =
    "lg:grid-cols-[200px_minmax(0,1fr)_200px] xl:grid-cols-[224px_minmax(0,1fr)_224px]"

  return (
    <div className="min-h-screen bg-transparent text-ananta-text">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ananta-border/70 bg-ananta-surface/95 backdrop-blur-xl">
        <div className="mx-auto grid min-h-16 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Brand */}
          <Link
            href="/"
            className="group col-start-1 row-start-1 min-w-0 leading-tight"
            aria-label="ANANTA DATABASE ホーム"
          >
            <span className="block text-[10px] font-semibold tracking-[0.28em] text-ananta-accent">
              ANANTA / DATABASE
            </span>
            <span className="mt-1 block text-xs text-ananta-muted sm:text-sm">
              無限大ANANTAの攻略情報・データベース
            </span>
          </Link>

          <form
            action="/search"
            role="search"
            className="relative col-span-2 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1"
          >
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ananta-muted"
            />
            <input
              type="search"
              name="q"
              placeholder="サイト内検索"
              aria-label="サイト内検索"
              className="h-10 w-full rounded-md border border-ananta-border bg-ananta-surface2/80 pl-9 pr-3 text-sm text-ananta-text outline-none transition-colors placeholder:text-ananta-muted/70 focus:border-ananta-accent focus:ring-1 focus:ring-ananta-accent"
            />
          </form>

          {/* Mobile navigation remains a Client Component */}
          <div className="col-start-2 row-start-1 shrink-0 md:hidden">
            <MobileSidebarToggle
              showSidebar={showSidebar}
              sidebarItems={sidebarNav}
              pageNavItems={pageNavItems}
              headerOffset={headerOffset}
              rightNavMode={rightNavMode}
              rightNavContent={rightNavContent}
            />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div
        className={[
          "mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-5 px-3 py-5 sm:gap-6 sm:px-5 lg:px-6",
          layoutColumns,
        ].join(" ")}
      >
        {/* Primary navigation */}
        {showSidebar ? (
          <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] self-start lg:block">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-ananta-border/60 bg-ananta-surface/75 p-3 shadow-lg shadow-black/10 backdrop-blur-xl">
              <SidebarNav items={sidebarNav} />
            </div>
          </aside>
        ) : (
          <div aria-hidden="true" className="hidden lg:block" />
        )}

        {/* Page content */}
        <main className="min-w-0 w-full">
          {children}
        </main>

        {/* Contextual navigation */}
        {showRightNav ? (
          <aside className="sticky top-24 hidden min-w-0 self-start xl:block">
            <div className="rounded-lg border border-ananta-border/60 bg-ananta-surface/75 p-4 backdrop-blur-xl">
              {rightNavMode === "nav" && (
                <PageNavigation
                  items={pageNavItems}
                  headerOffset={headerOffset}
                />
              )}

              {rightNavMode === "custom" && rightNavContent}
            </div>
          </aside>
        ) : (
          <div aria-hidden="true" className="hidden lg:block" />
        )}
      </div>

      {/* Footer advertisement */}
      {showFooterAd && (
        <div className="mx-auto mb-8 mt-8 max-w-[1400px] px-4 sm:px-6">
          <AdBanner />
        </div>
      )}
    </div>
  )
}
