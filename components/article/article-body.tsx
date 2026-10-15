
import ArticleEmbeds from "@/components/article/article-embeds";

type Props = {
  html: string;
};

export default function ArticleBody({ html }: Props) {
  return (
    <>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      <ArticleEmbeds />
    </>
  );
}
