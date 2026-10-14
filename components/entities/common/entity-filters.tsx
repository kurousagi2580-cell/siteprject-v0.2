// src/components/entities/common/EntityFilters.tsx
"use client";

import React from "react";

type EntityFiltersProps = {
  initial?: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  debounceMs?: number;
  className?: string;
};

export default function EntityFilters({ initial = {}, onChange, debounceMs = 300, className }: EntityFiltersProps) {
  const [q, setQ] = React.useState(initial.q ?? "");
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function handleChange(next: string) {
    setQ(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      onChange({ ...initial, q: next });
    }, debounceMs);
  }

  return (
    <div className={className}>
      <input
        type="search"
        value={q}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="検索..."
        className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 w-full"
      />
    </div>
  );
}
