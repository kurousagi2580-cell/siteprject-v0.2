// components/layout/mobile-sidebar-toggle.tsx
"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

type NavItem = { label: string; href: string };

type Props = {
  pageNavItems?: NavItem[];
  headerOffset?: number;
  rightNavMode?: "nav" | "custom" | "none";
  rightNavContent?: ReactNode | null;
};

export default function MobileSidebarToggle({
  pageNavItems = [],
  headerOffset = 180,
  rightNavMode = "nav",
  rightNavContent = null,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute left-0 top-0 h-full w-56 bg-ananta-surface p-4 pt-16 border-r border-ananta-border"
            style={{ paddingTop: headerOffset }}
          >
            {/* 既存の SidebarNav を再利用。pageNavItems を使う場合は SidebarNav 側で受け取る実装にする */}
            <SidebarNav />
            {/* 右カラムの custom 表示が必要ならここで rightNavContent を表示する */}
            {rightNavMode === "custom" && rightNavContent && (
              <div className="mt-4">{rightNavContent}</div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
