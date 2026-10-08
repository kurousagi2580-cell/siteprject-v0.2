// Mock data for the wireframe skeleton site.
// Types mirror the provided schema. All content is placeholder-level.

export type Character = {
  id: string
  name: string
  shortName: string
  imageUrl: string
  spaction: string
  type: string
  affiliationIds: string

  profile?: {
    age?: number
    height?: number
    birthday?: string
    favorites?: string[]
    voiceActor?: string
  }
}

export type Relationship = {
  id: string
  characterId: string
  targetCharacterId: string
  relationType: string
}

export type Affiliation = {
  id: string
  name: string
  shortName: string
  iconUrl: string
}

export type GameEvent = {
  id: string
  title: string
  status: string
  startDate: string
  endDate: string
  imageUrl: string
}

export type Update = {
  id: string
  verId: string
  title: string
  releaseDate: string
  officialUrl: string
}

export type Country = {
  id: string
  name: string
  shortName: string
  imageUrl: string
  description: string
}

export type Prefecture = {
  id: string
  name: string
  shortName: string
  parentId: string // country.id
  imageUrl: string
  description: string
  // ▼ 国の地図上のマーカー位置
  mapX: number
  mapY: number
}


export type GameMap = {
  id: string
  name: string
  shortName: string
  parentId: string // prefecture.id
  imageUrl: string
  description: string
  locations?: {
    id: string
    name: string
    fastTravel: boolean
  }[]
}

export type Page = {
  id: string
  title: string
  slug: string
  type: string
  createdAt: string
  updatedAt: string
}

export type Comment = {
  id: string
  number: number
  pageId: string
  userName: string
  content: string
  createdAt: string
  isAdopted: boolean
  deleteReason?: string
}

export type Item = {
  id: string
  name: string
  rarity: string
  iconUrl: string
}

export type Enemy = {
  id: string
  name: string
  attr: string
  lv: number
  iconUrl: string
}

export const affiliations: Affiliation[] = [
  { id: "aff-1", name: "月夜衆", shortName: "月夜", iconUrl: "" },
  { id: "aff-2", name: "電脳京都連合", shortName: "電京", iconUrl: "" },
  { id: "aff-3", name: "帝国軍", shortName: "帝国", iconUrl: "" },
]

export const characters: Character[] = [
  {
    id: "char-1",
    name: "カグヤ",
    shortName: "カグヤ",
    imageUrl: "",
    spaction: "地上",
    type: "火",
    affiliationIds: "aff-1",
    profile: {
      age: 19,
      height: 160,
      birthday: "3月12日",
      favorites: ["紅茶", "古書"],
      voiceActor: "CV未設定"
    }
  },
  {
    id: "char-2",
    name: "スサノオ",
    shortName: "スサノオ",
    imageUrl: "",
    spaction: "地上",
    type: "雷",
    affiliationIds: "aff-1",
    profile: {
      age: 28,
      height: 185,
      birthday: "7月22日",
      favorites: ["鍛錬", "肉料理"],
      voiceActor: "CV未設定"
    }
  },
]


export const relationships: Relationship[] = [
  { id: "rel-1", characterId: "char-1", targetCharacterId: "char-2", relationType: "兄妹" },
  { id: "rel-2", characterId: "char-1", targetCharacterId: "char-3", relationType: "同盟" },
  { id: "rel-3", characterId: "char-1", targetCharacterId: "char-4", relationType: "ライバル" },
]

export const events: GameEvent[] = [
  { id: "ev-1", title: "月下の戦場", status: "開催中", startDate: "2026/09/18", endDate: "2026/10/02", imageUrl: "" },
  { id: "ev-2", title: "秋の大型アップデート", status: "予告", startDate: "2026/09/23", endDate: "2026/09/30", imageUrl: "" },
]

export const updates: Update[] = [
  { id: "up-1", verId: "ver3.2", title: "秋の大型アップデート情報", releaseDate: "2026/09/23", officialUrl: "#" },
  { id: "up-2", verId: "ver3.2", title: "新キャラ「カグヤ」実装", releaseDate: "2026/09/20", officialUrl: "#" },
  { id: "up-3", verId: "ver3.1", title: "イベント「月下の戦場」開催中", releaseDate: "2026/09/18", officialUrl: "#" },
  { id: "up-4", verId: "ver3.0", title: "テスト1", releaseDate: "2026/09/18", officialUrl: "#" },
  { id: "up-5", verId: "ver2.8", title: "テスト2", releaseDate: "2026/09/18", officialUrl: "#" },
  { id: "up-6", verId: "ver2.7", title: "テスト3", releaseDate: "2026/09/18", officialUrl: "#" },
  { id: "up-7", verId: "ver2.6", title: "テスト4", releaseDate: "2026/09/18", officialUrl: "#" },
  { id: "up-8", verId: "ver2.5", title: "テスト5", releaseDate: "2026/09/18", officialUrl: "#" },
]

export const countries: Country[] = [
  {
    id: "country-1",
    name: "東方連邦",
    shortName: "東方",
    imageUrl: "/maps/country-east.png",
    description: "高度な技術文明を持つ東方地域。電脳都市が点在する。",
  },
  {
    id: "country-2",
    name: "西方帝国",
    shortName: "西方",
    imageUrl: "/maps/country-west.png",
    description: "古代遺跡と火山地帯が広がる帝国領。",
  },
]

export const prefectures: Prefecture[] = [
  {
    id: "pref-1",
    name: "電脳京都",
    shortName: "電京",
    parentId: "country-1",
    imageUrl: "/maps/pref-denkyoto.png",
    description: "東方連邦の中心都市。和風建築とサイバー技術が融合した街。",
    mapX: 120,
    mapY: 80,
  },
  {
    id: "pref-2",
    name: "灼熱火山",
    shortName: "火山",
    parentId: "country-2",
    imageUrl: "/maps/pref-volcano.png",
    description: "西方帝国の火山地帯。高温環境での探索が求められる。",
    mapX: 300,
    mapY: 200,
  },
]

export const maps: GameMap[] = [
  {
    id: "map-1",
    name: "電脳都心部",
    shortName: "都心部",
    parentId: "pref-1",
    imageUrl: "/maps/map-denkyoto-center.png",
    description: "電脳京都の中心エリア。高難度の敵が出現する。",
    locations: [
      { id: "loc-1", name: "中央広場", fastTravel: true },
      { id: "loc-2", name: "量子寺院", fastTravel: false },
    ],
  },
  {
    id: "map-2",
    name: "祇園データ街",
    shortName: "祇園",
    parentId: "pref-1",
    imageUrl: "/maps/map-gion.png",
    description: "祇園エリアのデータ街。商人やNPCが多い。",
    locations: [
      { id: "loc-3", name: "祇園入口", fastTravel: true },
    ],
  },
  {
    id: "map-3",
    name: "溶岩洞窟",
    shortName: "洞窟",
    parentId: "pref-2",
    imageUrl: "/maps/map-lava.png",
    description: "灼熱火山の内部にある洞窟。火属性の敵が多数出現。",
    locations: [
      { id: "loc-4", name: "洞窟入口", fastTravel: true },
    ],
  },
]

export const pages: Page[] = [
  { id: "pg-1", title: "「カグヤ」の最強編成は？", slug: "kaguya-best-team", type: "recommend", createdAt: "2026/09/21 12:25", updatedAt: "2026/09/21 12:25" },
  { id: "pg-2", title: "「月下の戦場」攻略ガイド", slug: "gekka-guide", type: "recommend", createdAt: "2026/09/21 12:15", updatedAt: "2026/09/21 12:15" },
  { id: "pg-3", title: "初心者おすすめキャラランキング", slug: "beginner-ranking", type: "comment", createdAt: "2026/09/21 11:30", updatedAt: "2026/09/21 11:30" },
  { id: "pg-4", title: "新マップ「電脳京都」の隠しルート", slug: "cyber-kyoto-hidden", type: "comment", createdAt: "2026/09/21 10:30", updatedAt: "2026/09/21 10:30" },
  { id: "pg-5", title: "ver3.2 武器性能比較表", slug: "weapon-compare", type: "comment", createdAt: "2026/09/21 09:30", updatedAt: "2026/09/21 09:30" },
]

export const comments: Comment[] = [
  { id: "cm-1", number: 3, pageId: "pg-1", userName: "ユーザー名", content: "おすすめ編成ありがとうございます！試してみます。", createdAt: "2026/09/21 12:30", isAdopted: true },
  { id: "cm-2", number: 2, pageId: "pg-1", userName: "ユーザー名", content: ">>1 に補足です。武器は「鬼切丸」が最適です。", createdAt: "2026/09/22 12:31", isAdopted: false },
  { id: "cm-3", number: 1, pageId: "pg-1", userName: "ユーザー名", content: "この編成、光属性が刺さりますね。", createdAt: "2026/09/22 12:32", isAdopted: false },
]

export const mapComments: Comment[] = [
  { id: "mcm-1", number: 3, pageId: "map-1", userName: "ユーザー名", content: "ボスは光パで余裕でした！", createdAt: "2026/09/20 10:00", isAdopted: false },
  { id: "mcm-2", number: 2, pageId: "map-1", userName: "ユーザー名", content: ">>1 隠しルートの情報助かります", createdAt: "2026/09/21 10:01", isAdopted: true },
]

export const items: Item[] = [
  { id: "item-1", name: "電脳チップ", rarity: "R", iconUrl: "" },
  { id: "item-2", name: "狐面のかけら", rarity: "SR", iconUrl: "" },
  { id: "item-3", name: "雷晶石", rarity: "SR", iconUrl: "" },
  { id: "item-4", name: "鬼切丸", rarity: "SSR", iconUrl: "" },
  { id: "item-5", name: "量子回路板", rarity: "R", iconUrl: "" },
  { id: "item-6", name: "祇園データ鍵", rarity: "SR", iconUrl: "" },
]

export const enemies: Enemy[] = [
  { id: "enemy-1", name: "鬼武者ドローン", attr: "闇", lv: 35, iconUrl: "" },
  { id: "enemy-2", name: "サイバー狐", attr: "火", lv: 38, iconUrl: "" },
  { id: "enemy-3", name: "雷神ガーディアン", attr: "雷", lv: 40, iconUrl: "" },
  { id: "enemy-4", name: "深海ゴースト", attr: "水", lv: 32, iconUrl: "" },
  { id: "enemy-5", name: "溶岩ゴーレム", attr: "火", lv: 42, iconUrl: "" },
  { id: "enemy-6", name: "量子祠の守護者", attr: "光", lv: 45, iconUrl: "" },
]

// Character skill placeholder data
export type Skill = { label: string; name: string; description: string }
export const characterSkills: Skill[] = [
  { label: "通常攻撃", name: "桜花連��", description: "敵単体に物理ダメージ×3" },
  { label: "スキル1", name: "炎舞", description: "範囲内の敵全体に火属性ダメージ（CT: 8秒）" },
  { label: "スキル2", name: "月華斬", description: "敵単体に超高倍率ダメージ＋防御デバフ（CT: 15秒）" },
  { label: "奥義", name: "天照紅蓮", description: "全体に大ダメージ＋味方全体にバフ" },
]

export type StatusRow = { lv: number; hp: number; atk: number; def: number; spd: number; attr: string }
export const characterStatus: StatusRow[] = [
  { lv: 25, hp: 3000, atk: 800, def: 400, spd: 100, attr: "火" },
  { lv: 50, hp: 3500, atk: 900, def: 450, spd: 110, attr: "火" },
  { lv: 75, hp: 4000, atk: 1000, def: 500, spd: 120, attr: "火" },
  { lv: 100, hp: 4500, atk: 1100, def: 550, spd: 130, attr: "火" },
]

// Map detail placeholder data
export type EnemyRow = { name: string; lv: number; attr: string; weak: string; drop: string }
export const mapEnemies: EnemyRow[] = [
  { name: "鬼武者ドローン", lv: 35, attr: "闇", weak: "光", drop: "電脳チップ×2" },
  { name: "サイバー狐", lv: 38, attr: "火", weak: "水", drop: "狐面のかけら×1" },
  { name: "雷神ガーディアン", lv: 40, attr: "雷", weak: "地", drop: "雷晶石×1" },
  { name: "BOSS: 電脳天守主", lv: 45, attr: "闇", weak: "光", drop: "★鬼切丸（低確率）" },
]

export const mapDrops: string[] = [
  "電脳チップ — 合成素材（エリアA, B共通）",
  "狐面のかけら — アクセサリ素材（エリアB限定）",
  "雷晶石 — 武器強化素材（エリアC限定）",
  "★鬼切丸 — SSR武器（ボスドロップ / 確率0.5%）",
]

export const mapRoute: string[] = [
  "エリアAで雑魚を殲滅しLvを上げる",
  "エリアBの隠し通路から宝箱を回収",
  "エリアCのギミック（灯籠パズル）を解除",
  "ボス戦：光属性パーティで挑む（カグヤ推奨）",
]

export function getCharacter(id: string) {
  return characters.find((c) => c.id === id)
}

export function getMap(id: string) {
  return maps.find((m) => m.id === id)
}

export function getAffiliationName(id: string) {
  return affiliations.find((a) => a.id === id)?.name ?? id
}