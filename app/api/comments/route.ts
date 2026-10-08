import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const body = await req.json()
  const { page_id, user_name, content, parent_id } = body

  // ▼ ① page_id ごとの最大 number を取得
  const { data: maxData, error: maxError } = await supabase
    .from("comments")
    .select("number")
    .eq("page_id", page_id)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (maxError) {
    console.error(maxError)
    return NextResponse.json({ error: maxError.message }, { status: 500 })
  }

  const nextNumber = maxData?.number ? maxData.number + 1 : 1

  // ▼ ② コメントを挿入
  const { data, error } = await supabase
    .from("comments")
    .insert({
      page_id,
      user_name,
      content,
      parent_id: parent_id ?? null,
      number: nextNumber,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
