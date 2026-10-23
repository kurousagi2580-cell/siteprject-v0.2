import Link from "next/link"
import { relationshipGraphHref } from "@/lib/grah/graph-link"

/**
 * 【サンプル】キャラクター詳細ページに置くリンク。
 * 使い方:  <RelationshipGraphLink slug={character.slug} />
 * 相関図にそのキャラがいなければ、選択なしで相関図が開く。
 */
export function RelationshipGraphLink({ slug }: { slug: string }) {
  return (
    <Link
      href={relationshipGraphHref(slug)}
      className="inline-flex items-center rounded border border-ananta-border bg-ananta-surface2 px-3 py-1.5 text-sm text-ananta-text no-underline transition hover:border-ananta-accent/60"
    >
      相関図で見る
    </Link>
  )
}
