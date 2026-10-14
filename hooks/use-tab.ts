"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useTab(defaultTab: string = "all") {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("tab") ?? defaultTab;

  const setTab = useCallback((newTab: string) => {
    const p = new URLSearchParams(Array.from(params.entries()));
    if (newTab) p.set("tab", newTab); else p.delete("tab");
    p.delete("page"); // 新しいタブでページリセットしたければ
    const newUrl = `/search?${p.toString()}`;

    try {
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl === newUrl) return;
    } catch (e) {}

    router.push(newUrl);
  }, [params?.toString(), router]);

  return { tab: current, setTab };
}
