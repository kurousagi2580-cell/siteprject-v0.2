"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function useSearch(initialQ = "") {
  const router = useRouter();
  const params = useSearchParams();

  // 現在の q をプリミティブで取得（params オブジェクト自体は依存にしない）
  const qFromParams = params?.get("q") ?? initialQ;

  const [q, setQ] = useState<string>(qFromParams);
  const [debounced, setDebounced] = useState<string>(qFromParams);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    // 現在の URL の q 値を取得して比較する（安全ガード）
    const currentQ = params?.get("q") ?? "";
    if ((debounced ?? "") === (currentQ ?? "")) {
      // 同じなら何もしない（これがループ防止の肝）
      return;
    }

    const p = new URLSearchParams(Array.from(params.entries()));
    if (debounced) p.set("q", debounced);
    else p.delete("q");
    // 新しい検索ではページをリセット
    p.delete("page");

    const newUrl = `/search?${p.toString()}`;
    // さらに念のため、現在の location.pathname/search と比較して同じなら push しない
    try {
      const current = window.location.pathname + window.location.search;
      if (current === newUrl) return;
    } catch (e) {
      // SSR 環境では window がないので無視
    }

    router.push(newUrl, { scroll: false });
  // 依存は debounced と params.get("q") のプリミティブだけにする
  }, [debounced, params?.get("q"), router]);

  const onChange = useCallback((v: string) => setQ(v), []);
  return { q, setQ, onChange, debounced };
}
