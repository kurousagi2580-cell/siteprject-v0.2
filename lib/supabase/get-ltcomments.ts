import { fetchData } from "./queries"

export async function getLatestComments() {
  return await fetchData<LatestComment>("comments", {
    select: `
      id,
      content,
      created_at,
      user_name,
      page:pages (
        id,
        slug,
        title,
        type
      )
    `,
    order: [
      { column: "page_id", ascending: true },
      { column: "created_at", ascending: false }
    ],
    limit: 50,
  })
}
