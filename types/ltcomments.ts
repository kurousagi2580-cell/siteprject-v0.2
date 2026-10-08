type LatestComment = {
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
