// markdown/slugify.ts
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")            // HTML タグ除去
    .replace(/[^a-z0-9\s\-]/g, "")      // 英数字とスペースとハイフン以外を除去
    .replace(/\s+/g, "-")               // 空白をハイフンに
    .replace(/\-+/g, "-")               // 連続ハイフンを単一に
    .replace(/^\-+|\-+$/g, "");         // 先頭末尾のハイフンを削除
}
