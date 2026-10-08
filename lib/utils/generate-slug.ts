import { toRomaji } from "wanakana"

const nameDict: Record<string, string> = {
  "太郎": "たろう",
  "無限大": "むげんだい",
  "ANANTA": "あなんた",
  "時夜": "しいぇ",
  "魏瓔龍": "うぇいりゅう",
  "南島雄": "みなみじまかず",
  "重霄": "ちょうしょう",
  "新啓": "しんけい",
}

function toHiraganaByDict(name: string) {
  let result = name

  for (const [kanji, hira] of Object.entries(nameDict)) {
    result = result.replaceAll(kanji, hira)
  }

  // カタカナ → ひらがな
  result = result.replace(/[ァ-ン]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  )

  return result
}

export function generateSlug(name: string) {
  const hiragana = toHiraganaByDict(name)

  let slug = toRomaji(hiragana)
  slug = slug.toLowerCase()
  slug = slug.replace(/[^a-z0-9]+/g, "-")
  slug = slug.replace(/^-+|-+$/g, "")

  return slug
}
