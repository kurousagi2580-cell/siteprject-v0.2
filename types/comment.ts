export type Comment = {
  id: string
  page_id: string
  number: number
  user_name: string
  content: string
  parent_id?: string
  is_adopted: boolean
  delete_reason?: string
  created_at: string
}

export type LatestComment = {
  id: string
  content: string
  created_at: string
  user_name: string
  page: {
    id: string
    slug: string
    title: string
    type: "country" | "character" | "map" | "page"
  }
}
