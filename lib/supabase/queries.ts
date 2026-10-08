
import { createSupabaseServerClient } from "./client"
const supabase = createSupabaseServerClient()

type FilterOperator =
  | "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
  | "like" | "ilike" | "is" | "in"
  | "contains" | "containedBy" | "overlaps"

type Filter = {
  column: string
  operator: FilterOperator
  value: unknown
}

type Order = {
  column: string
  ascending?: boolean
  nullsFirst?: boolean
}

type QueryOptions = {
  select?: string
  filters?: Filter[]
  order?: Order[]
  limit?: number
  offset?: number
}

type SingleOptions = QueryOptions & {
  single: true
}

type MultipleOptions = QueryOptions & {
  single?: false
}

// 1件取得
export async function fetchData<T = unknown>(
  table: string,
  options: SingleOptions
): Promise<T | null>

// 複数件取得
export async function fetchData<T = unknown>(
  table: string,
  options?: MultipleOptions
): Promise<T[]>

// 実装
export async function fetchData<T = unknown>(
  table: string,
  options: QueryOptions & { single?: boolean } = {}
): Promise<T | T[] | null> {
  const {
    select = "*",
    filters = [],
    order = [],
    limit,
    offset,
    single = false,
  } = options

  let query = supabase.from(table).select(select)

  //console.log("テーブル名：" + table)
  for (const { column, operator, value } of filters) {
    switch (operator) {
      case "eq":
        query = query.eq(column, value as never)
        break
      case "neq":
        query = query.neq(column, value as never)
        break
      case "gt":
        query = query.gt(column, value as never)
        break
      case "gte":
        query = query.gte(column, value as never)
        break
      case "lt":
        query = query.lt(column, value as never)
        break
      case "lte":
        query = query.lte(column, value as never)
        break
      case "like":
        query = query.like(column, value as string)
        break
      case "ilike":
        query = query.ilike(column, value as string)
        break
      case "is":
        query = query.is(column, value as never)
        break
      case "in":
        query = query.in(column, value as never[])
        break
      case "contains":
        query = query.contains(column, value as never)
        break
      case "containedBy":
        query = query.containedBy(column, value as never)
        break
      case "overlaps":
        query = query.overlaps(column, value as never)
        break
    }
  }

  for (const item of order) {
    query = query.order(item.column, {
      ascending: item.ascending ?? true,
      nullsFirst: item.nullsFirst,
    })
  }

  if (offset !== undefined) {
    const start = offset
    const end = start + (limit ?? 100) - 1
    query = query.range(start, end)
  } else if (limit !== undefined) {
    query = query.limit(limit)
  }

  if (single) {
    const { data, error } = await query.maybeSingle()
    if (error) throw error
    return data as T | null
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as T[]
}