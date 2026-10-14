// components/article/heading-store.ts
"use client";

import { create } from "zustand";
import type { Heading } from "@/types/articles/heading";

type ArticleHeadingsState = {
  headings: Heading[];
  setHeadings: (newHeadings: Heading[]) => void;
  clearHeadings: () => void;
};

export const articleHeadingsStore = create<ArticleHeadingsState>((set) => ({
  headings: [],
  setHeadings: (newHeadings) => set({ headings: newHeadings }),
  clearHeadings: () => set({ headings: [] }),
}));
