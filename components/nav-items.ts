export type NavItem = { label: string; href: string }

export type SidebarNavItem = {
  label: string
  children: {
    label: string
    href: string
  }[]
}

export const aggregateSidebarNav: SidebarNavItem[] = [
  {
    label: "キャラクター図鑑",
    children: [
      { label: "プレイアブル", href: "/aggregate/characters" },
      { label: "NPC", href: "/aggregate/characters/npc" },
      { label: "調査中", href: "/aggregate/characters/investigating" },
    ],
  },
  {
    label: "地理",
    children: [
      { label: "国一覧", href: "/aggregate/countries" },
      { label: "地域一覧", href: "/aggregate/regions" },
    ],
  },
  {
    label: "世界観",
    children: [
      { label: "所属", href: "/aggregate/affiliations" },
      { label: "用語", href: "/aggregate/words" },
    ],
  },
]
