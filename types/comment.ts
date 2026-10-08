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
