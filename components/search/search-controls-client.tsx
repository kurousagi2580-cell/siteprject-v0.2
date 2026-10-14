// src/components/search/SearchControls.client.tsx
"use client";
import React from "react";
import useSearch from "@/hooks/use-search";

export default function SearchControls({ initialQ = "" }: { initialQ?: string }) {
  const { q, onChange } = useSearch(initialQ);
  return (
    <div className="search-controls">
      <input
        aria-label="検索"
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="検索ワードを入力"
        className="input"
      />
    </div>
  );
}
