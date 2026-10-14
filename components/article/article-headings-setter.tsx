// components/article/article-headings-setter.tsx
"use client";

import { useEffect } from "react";
import { articleHeadingsStore } from "./heading-store";
import type { Heading } from "@/types/articles/heading";

export default function ArticleHeadingsSetter({ headings }: { headings: Heading[] }) {
  const setHeadings = articleHeadingsStore((s) => s.setHeadings);
  const clearHeadings = articleHeadingsStore((s) => s.clearHeadings);

  useEffect(() => {
    setHeadings(headings ?? []);
    return () => {
      clearHeadings();
    };
  }, [headings, setHeadings, clearHeadings]);

  return null;
}
