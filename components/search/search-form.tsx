// components/search/search-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="flex gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="検索ワード"
        className="border p-2 flex-1"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white">検索</button>
    </form>
  );
}
