import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAdmin } from "@/lib/auth/require-admin"
import { upsertCharacterRelationshipPositions } from "@/actions/character-relationship-positions-actions-server"
import { saveCharacterRelationshipFrames } from "@/actions/character-relationship-frames-actions-server"

const coord = z.number().finite().min(-100_000).max(100_000)
const size = z.number().finite().positive().max(100_000)

const frameSchema = z
  .object({
    id: z.string().uuid().optional(),
    affiliation_id: z.string().uuid().nullable(),
    label: z.string().trim().max(60).nullable(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable(),
    position_x: coord.nullable(),
    position_y: coord.nullable(),
    width: size.nullable(),
    height: size.nullable(),
    is_visible: z.boolean(),
  })
  .superRefine((f, ctx) => {
    const rect = [f.position_x, f.position_y, f.width, f.height]
    // 位置と大きさは「4つとも指定」か「4つとも null（自動）」のどちらか
    if (rect.some((v) => v === null) && rect.some((v) => v !== null)) {
      ctx.addIssue({ code: "custom", message: "rect must be all set or all null" })
    }
    // 自由枠（所属なし）は id・位置・名前が必須
    if (f.affiliation_id === null && (!f.id || f.position_x === null || !f.label)) {
      ctx.addIssue({ code: "custom", message: "custom frame requires id, rect and label" })
    }
  })

const bodySchema = z
  .object({
    diagram_key: z.string().trim().min(1).max(200).default("main"),
    positions: z
      .array(z.object({ character_id: z.string().uuid(), position_x: coord, position_y: coord }))
      .max(500)
      .default([]),
    frames: z
      .object({
        upserts: z.array(frameSchema).max(200).default([]),
        deleteIds: z.array(z.string().uuid()).max(200).default([]),
      })
      .default({ upserts: [], deleteIds: [] }),
  })
  .refine((b) => b.positions.length > 0 || b.frames.upserts.length > 0 || b.frames.deleteIds.length > 0, {
    message: "nothing to save",
  })

// 相関図の座標とキャラの枠をまとめて保存する（管理者のみ）
export async function PUT(req: Request) {
  const denied = await guardAdmin()
  if (denied) return denied

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "invalid json" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "invalid payload" }, { status: 400 })
  }
  const { diagram_key, positions, frames } = parsed.data

  try {
    if (positions.length > 0) await upsertCharacterRelationshipPositions(diagram_key, positions)
    if (frames.upserts.length > 0 || frames.deleteIds.length > 0) {
      await saveCharacterRelationshipFrames(diagram_key, frames)
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("relationship-positions PUT error:", e)
    return NextResponse.json({ success: false, error: "save failed" }, { status: 500 })
  }
}
