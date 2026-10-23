/** キャラクター詳細ページから相関図を開くリンク（そのキャラを選択した状態で開く） */
export function relationshipGraphHref(slug: string) {
  return `/relationgraph?character=${encodeURIComponent(slug)}`
}
