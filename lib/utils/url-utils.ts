

//TOPぺージでの変換
export function resolvePageUrl(page: LatestComment["page"]) {
  switch (page.type) {
    case "country":
      return `/countries/${page.slug}`
    case "character":
      return `/characters/${page.slug}`
    case "map":
      return `/maps/${page.slug}`
    default:
      return `/pages/${page.slug}`
  }
}

//関連記事用
export function buildEntityUrl(entityType: string, entitySlug: string, articleSlug?: string) {
  return articleSlug
    ? `/${entityType}/${entitySlug}/${articleSlug}`
    : `/${entityType}/${entitySlug}`
}


