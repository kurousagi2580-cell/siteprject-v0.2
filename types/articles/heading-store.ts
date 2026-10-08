"use client"

import { create } from "zustand"
import type { Heading } from "./heading"

type ArticleHeadingsState = {
  headings: Heading[]
  setHeadings: (newHeadings: Heading[]) => void
}

export const articleHeadingsStore = create<ArticleHeadingsState>((set) => ({
  headings: [],
  setHeadings: (newHeadings) => set({ headings: newHeadings }),
}))
