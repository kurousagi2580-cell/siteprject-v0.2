// components/layout/mobile-sidebar-toggle.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { PageNavigation } from "@/components/ui/page-navigation";
import type { SidebarNavItem } from "@/components/nav-items";

type NavItem = { label: string; href: string };

type Props = {
  showSidebar: boolean;
  sidebarItems: SidebarNavItem[];
  pageNavItems?: NavItem[];
  headerOffset?: number;
  rightNavMode?: "nav" | "custom" | "none";
  rightNavContent?: ReactNode | null;
};

export default function MobileSidebarToggle({
  showSidebar,
  sidebarItems,
  pageNavItems = [],
  headerOffset = 180,
  rightNavMode = "nav",
  rightNavContent = null,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const hasPageNavigation = rightNavMode === "nav" && pageNavItems.length > 0;
  const hasCustomNavigation = rightNavMode === "custom" && rightNavContent != null;

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  if (!showSidebar && !hasPageNavigation && !hasCustomNavigation) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="サイドバー開閉ボタン"
        onClick={() => setSidebarOpen((v) => !v)}
        className="md:hidden text-ananta-text"
      >
        {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {sidebarOpen && portalRoot && createPortal(
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside
            aria-label="メニュー"
            className="absolute inset-y-0 right-0 flex w-[60vw] max-w-sm flex-col overflow-hidden border-l border-ananta-border bg-ananta-surface shadow-2xl shadow-black/40"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-ananta-border px-4 py-4">
              <span className="text-sm font-semibold text-ananta-text">メニュー</span>
              <button
                type="button"
                aria-label="メニューを閉じる"
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-ananta-muted transition-colors hover:bg-ananta-surface2 hover:text-ananta-text"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
              {showSidebar && <SidebarNav items={sidebarItems} />}
              {hasPageNavigation && (
                <div className={showSidebar ? "mt-6 border-t border-ananta-border pt-5" : ""}>
                  <PageNavigation items={pageNavItems} headerOffset={headerOffset} />
                </div>
              )}
              {hasCustomNavigation && <div className="mt-4">{rightNavContent}</div>}
            </div>
          </aside>
        </div>,
        portalRoot,
      )}
    </>
  );
}
