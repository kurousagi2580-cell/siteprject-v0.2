import type { GraphFrame } from "@/types/relationship-graph"

/** 枠に使える色（サイトの配色に合わせた選択肢） */
export const FRAME_COLORS = [
  "#B9FF3D", "#22C55E", "#EF4444", "#3B82F6", "#8B5CF6",
  "#F97316", "#06B6D4", "#EC4899", "#FACC15", "#94A3B8",
] as const

export const FRAME_PAD_BASE = 36 // メンバーと枠の間の余白（一番内側の枠）
export const FRAME_PAD_STEP = 28 // 入れ子の外側の枠ほど、この分だけ余白を足す
export const FRAME_MIN_W = 120
export const FRAME_MIN_H = 80

/** 色を指定していない枠の色（key から決まるので、毎回同じ色になる） */
export function autoFrameColor(key: string) {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  const palette = FRAME_COLORS.slice(1) // 先頭のアクセント色は選択・強調用に残す
  return palette[h % palette.length]
}

/** ラベルの文字色（背景色が明るければ黒、暗ければ白） */
export function frameTextColor(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#0B0F14" : "#FFFFFF"
}

/** 自動配置で「同じ所属は近くに集まる」ようにするための弱い引力の指定 */
export function frameLayoutGroups(
  frames: Pick<GraphFrame, "affiliationId" | "memberIds" | "height">[],
) {
  return frames
    .filter((f) => f.affiliationId && f.memberIds.length >= 2)
    .map((f) => ({ ids: f.memberIds, distance: 170 + 60 * f.height }))
}
