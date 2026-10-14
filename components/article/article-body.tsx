// components/article/article-body.tsx
"use client";

import ArticleHeadingsSetter from "@/components/article/article-headings-setter";
import type { Heading } from "@/types/articles/heading";
import ArticleEmbeds from "@/components/article/article-embeds";

type Props = {
  html: string;
  headings: Heading[];
};

export default function ArticleBody({ html, headings }: Props) {
  return (
    <>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      <ArticleHeadingsSetter headings={headings} />
      <ArticleEmbeds />
    </>
  );
}
